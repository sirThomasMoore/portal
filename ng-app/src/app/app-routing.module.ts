import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent, LoginComponent, RegisterComponent, UserManagementComponent, UserProfileComponent } from './components/';
import { AuthGuardService, RegistrationGuardService, LoginGuardService } from './guards';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'register', component: RegisterComponent, canActivate: [RegistrationGuardService]},
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuardService]},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
