import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	public user = this.authService.getUser();
	userFormGroup: UntypedFormGroup;
	hide = true;
	matcher = new MyErrorStateMatcher();

	constructor(private authService: AuthService, private formBuilder: UntypedFormBuilder) { }

	ngOnInit(): void {
		this.userFormGroup = this.createForm();
	}

	onSubmit(): void {
		const pkg = {
			email: this.user.email,
			newPassword: this.userFormGroup.value.newPassword,
			confirmNewPassword: this.userFormGroup.value.confirmNewPassword,
		}
		this.authService.updateUser(pkg).subscribe((data) => {
			console.log(data);
		})
	}

	createForm(): UntypedFormGroup {
		return this.formBuilder.group({
			name: new UntypedFormControl({ value: this.user.name, disabled: true }),
			email: new UntypedFormControl({ value: this.user.email, disabled: true }),
			role: new UntypedFormControl({ value: this.user.role, disabled: true }),
			newPassword: new UntypedFormControl(null, [Validators.required]),
			confirmNewPassword: new UntypedFormControl(null),
		}, {validators: this.checkPasswords });
	}

	checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
		let pass = group.get('newPassword').value;
		let confirmPass = group.get('confirmNewPassword').value
		return pass === confirmPass ? null : { notSame: true }
	}

}
