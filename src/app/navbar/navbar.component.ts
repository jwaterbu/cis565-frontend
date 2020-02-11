import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() cartItemCount: number = 0;
  currentUser: IUser;

  constructor(private router: Router, 
    private cartService: CartService, 
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if(this.currentUser)
        this.cartService.loadCartProducts().subscribe();
    });
    this.cartService.currentItemCount.subscribe(count => this.cartItemCount = count);
  }
  
  logout() {
    this.authenticationService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/login']);
}
}
