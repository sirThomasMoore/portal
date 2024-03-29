import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginFormGroup: UntypedFormGroup;

	constructor(private formBuilder: UntypedFormBuilder, private authService: AuthService, private router: Router) { }

	ngOnInit() {
		this.loginFormGroup = this.formBuilder.group({
			password: ['', [Validators.required]],
			email: ['', [Validators.required]]
		});
	}

	getErrorMessage() {
		return this.loginFormGroup.get('username').hasError('required')
			? 'You must enter a value'
			: this.loginFormGroup.get('password').hasError('required')
				? 'You must enter a value'
				: '';
	}

	login(): void {
		if (this.loginFormGroup.valid) {
			this.authService.login(this.loginFormGroup.getRawValue()).subscribe(data => {
				this.router.navigate(['/dashboard']);
			});
		}
	}
}
