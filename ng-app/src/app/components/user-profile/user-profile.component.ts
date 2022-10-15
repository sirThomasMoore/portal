import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	public user = this.authService.getUser();
	userFormGroup: UntypedFormGroup;

	constructor(private authService: AuthService, private formBuilder: UntypedFormBuilder) { }

	ngOnInit(): void {
		this.userFormGroup = this.createForm();
	}

	onSubmit(): void {
		console.log('onSubmit fired!');
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: new UntypedFormControl({ value: this.user.name, disabled: true }),
			email: new UntypedFormControl({ value: this.user.email, disabled: true }),
			role: new UntypedFormControl({ value: this.user.role, disabled: true }),
		});
	}

}
