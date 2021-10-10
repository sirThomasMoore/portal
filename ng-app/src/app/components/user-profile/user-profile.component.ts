import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	public user = this.authService.getUser();
	userFormGroup: FormGroup;

	constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.userFormGroup = this.createForm();
	}

	onSubmit(): void {
		console.log('onSubmit fired!');
	}

	createForm(): FormGroup {
		return this.formBuilder.group({
			name: new FormControl({ value: this.user.name, disabled: true }),
			email: new FormControl({ value: this.user.email, disabled: true }),
			role: new FormControl({ value: this.user.role, disabled: true }),
		});
	}

}
