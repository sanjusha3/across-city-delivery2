import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UserComponent } from './user/user.component';
import { UpdateComponent } from './user/update/update.component';
import { AdminComponent } from './admin/admin.component';
import { NewuserComponent } from './admin/newuser/newuser.component';
import { CanActivate } from './auth.guard';
import { CanActivate2 } from './auth.guard';
// import { CanActivate3 } from './auth.guard';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [CanActivate] },
  {
    path: 'user/update',
    component: UpdateComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'admin',
    // pathMatch: 'full',
    component: AdminComponent,
    canActivate: [CanActivate2],

    // canActivateChild: [CanActivate2],
    // children: [
    // { path: 'user', component: NewuserComponent },
    // { path: 'user/:id', component: LoginComponent },
    // ],
  },

  {
    path: 'admin/user',
    // pathMatch: 'full',
    component: NewuserComponent,
    canActivate: [CanActivate2],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
