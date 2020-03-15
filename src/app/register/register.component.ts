import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  pageTitle: string = "Register";
  registerForm: FormGroup;

  returnUrl: string;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(264)]],
      password: ['', [Validators.required, Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, { validators: MustMatch('password', 'confirmPassword') });

    if (this.authenticationService.currentUserValue) {
      //if logged in go to welcome page
      this.router.navigate(['/profile']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.userService.addUser(this.f.username.value, this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this._snackBar.open('Your accout has succesfully been created', '', {
            duration: 4000
          })
          this.loginUser(this.f.email.value, this.f.password.value);
        },
        error => {
          let message
          if (error.error.errors[0].message === "email must be unique") {
            message = 'This email account exists already please try another.';
          } else {
            message = 'Sorry we are unable to process your request right now.';
            console.log(error);
          }
          this._snackBar.open(message, '', {
            duration: 7000
          })
        });
    ;
  }

  loginUser(email: string, password: string) {
    this.authenticationService.login(email, password)
      .pipe(first())
      .subscribe(
        data => {
          this.authenticationService.saveUser().subscribe(data => this.router.navigate([this.returnUrl]))
        },
        error => {
          this._snackBar.open(`Unable to login for ${email}`, '', {
            duration: 2000
          })
        });
    ;
  }
}
