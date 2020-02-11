import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pageTitle: string = "Login";
  loginForm: FormGroup;
  returnUrl: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar, private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      //if logged in go to welcome page
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this._snackBar.open(`Login succesfull for ${this.f.email.value}`, '', {
            duration: 2000
          })
          this.authenticationService.saveUser().subscribe(data => this.router.navigate([this.returnUrl]))
        },
        error => {
          this._snackBar.open(`Unable to login for ${this.f.email.value}`, '', {
            duration: 2000
          })
        });
    ;
  }
}
