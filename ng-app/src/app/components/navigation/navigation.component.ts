import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit {
	selected: string = '';

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		this.updateSelected();
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	updateSelected(): void {
		this.selected = window.location.pathname;
	}

}
