import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent, LoginComponent, RegisterComponent, UserManagementComponent, UserProfileComponent } from './components';

import { httpInterceptorProviders } from './helpers/';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

const appearance: MatFormFieldDefaultOptions = {
	appearance: 'fill'
};
@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		LoginComponent,
		RegisterComponent,
		UserManagementComponent,
		UserProfileComponent,
		HeaderComponent,
		NavigationComponent,
	],
	exports: [],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		HttpClientModule,
		MaterialModule,
		ReactiveFormsModule
	],
	providers: [
		AuthService,
		ConfigService,
		{ provide: APP_BASE_HREF, useValue: '/' },
		{
			provide: APP_INITIALIZER,
			useFactory: (configService: ConfigService) => () =>
				configService.loadConfigData().toPromise(),
			deps: [ConfigService],
			multi: true
		},
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: appearance
		},
		httpInterceptorProviders,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
