import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormControl: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginFormControl = this.formBuilder.group({
      password: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });
  }

  getErrorMessage() {
    return this.loginFormControl.get('username').hasError('required')
      ? 'You must enter a value'
      : this.loginFormControl.get('password').hasError('required')
      ? 'You must enter a value'
      : '';
  }

  login(): void {
    if (this.loginFormControl.valid) {
      this.authService.login(this.loginFormControl.getRawValue()).subscribe(data => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
