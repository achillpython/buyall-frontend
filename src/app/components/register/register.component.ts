import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import ConfirmFieldMatchValidator from 'src/app/core/validators/confirm-field-match.validator';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted: boolean;
  subRegister: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      lastName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: [null, Validators.compose([Validators.required])],
      dateBirthday: [null, Validators.compose([Validators.required])]
    }, {
      validators: [ConfirmFieldMatchValidator('password', 'confirmPassword')]
    });
  }

  ngOnDestroy(): void {
    this.subRegister.unsubscribe();
  }

  onRegisterSubmit(): void {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.subRegister = this.authService.register(this.registerForm.value)
        .subscribe((user: IUser) => {
          this.authService.setUser(user);
          this.router.navigate(['/']);
        }, (err: any) => {
          if (err.error === 'User already has registered') {
            this.email.setErrors({emailTaken: true});
          }
        });
    }
  }

  get firstName(): AbstractControl {
    return this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.registerForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.registerForm.get('confirmPassword');
  }

  get dateBirthday(): AbstractControl {
    return this.registerForm.get('dateBirthday');
  }
}
