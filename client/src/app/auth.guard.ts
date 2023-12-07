import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

const localRole = localStorage.getItem('role');

export const CanActivate = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const localRole = localStorage.getItem('role');

  console.log(authService.IsAuthenticated());
  console.log(authService.isAuthenticated);
  console.log(authService.IsAdmin());
  console.log(authService.isAdmin);
  if (authService.IsAuthenticated() || localRole === 'USER') {
    console.log('isauth is true');
    return true;
  } else if (authService.IsAdmin() || localRole === 'ADMIN') {
    console.log('innnnnnnn');
    toastr.warning('You are not authorized to access the Requested resource!');
    router.navigate(['/admin']);
    return true;
  } else {
    // alert('You are not authorized!!');
    router.navigate(['/unauthorized']);
    return false;
  }
};

export const CanActivate2 = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  if (authService.IsAdmin() || localRole === 'ADMIN') {
    return true;
  } else if (authService.IsAuthenticated() || localRole === 'USER') {
    toastr.warning('You are not authorized to access the Requested resource!');
    router.navigate(['/user']);
    return false;
  } else {
    // alert('You are not authorized!!');
    router.navigate(['/unauthorized']);
    return false;
  }
};

export const CanActivate3 = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  return true
  if (authService.IsAuthenticated() || localRole === 'USER') {
    console.log('isauth is trueggggggggggggggggg');
    return true;
  } 
  // else if (authService.IsAdmin() || localRole === 'ADMIN') {
  //   console.log('innnnnnnn');
  //   toastr.warning('You are not authorized to access the Requested resource!');
  //   router.navigate(['/admin']);
  //   return true;
  // } 
  else {
    // alert('You are not authorized!!');
    router.navigate(['/unauthorized']);
    return false;
  }
};
