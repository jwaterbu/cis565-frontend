import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { IUser } from '../models/user';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  pageTitle: string = "Edit User"
  userForm: FormGroup;
  private sub: Subscription;
  user: IUser;
  errorMessage: string;

  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [ Validators.minLength(4), Validators.maxLength(20)]],
      admin: ['', Validators.required]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getUser(id);
      });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    const u = { ...this.user, ...this.userForm.value };
    let passwd = this.userForm.controls.password.value === null ? '' : this.userForm.controls.password.value.trim();
    if (u) {
      this.userService.updateUser(u.id, u.username, u.email, u.admin, passwd).subscribe({
        next: () => {
          this._snackBar.open(`User has been updated!`, '', {
            duration: 4000
          });
          this.onSaveComplete()
        },
        error: err => console.log(err)
      })
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/admin']);
  }

  getUser(id: number): void {
    this.userService.getUser(id)
      .subscribe({
        next: (user: IUser) => {
          if (user) {
            this.displayUser(user);
          } else {
            this.router.navigate(['/admin']);
          }
        },
        error: err => {
          this.errorMessage = err
          console.log(this.errorMessage);
        }
      });
  }

  displayUser(user: IUser): void {
    if (this.userForm) {
      this.userForm.reset();
    }
    this.user = user;

    this.pageTitle = `Edit User: ${this.user.username}`;
    // Update the data on the form
    this.userForm.patchValue({
      username: this.user.username,
      email: this.user.email,
      admin: this.user.admin
    });
  }
}