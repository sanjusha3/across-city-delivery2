import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './user/order/order.component';
import { AdminComponent } from './admin/admin.component';
import { CanActivate } from './auth.guard';
import { CanActivate2 } from './auth.guard';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [CanActivate],
    // canActivateChild: [CanActivate],
    // children: [{ path: 'order', component: OrderComponent }],
  },
  { path: 'user/order', component: OrderComponent, canActivate: [CanActivate] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [CanActivate2],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  // { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
