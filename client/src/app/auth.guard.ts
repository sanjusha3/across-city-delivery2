import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

export const CanActivate = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.IsAuthenticated()) {
    return true;
  } else {
    alert('You are not authorized!!');
    router.navigate(['/login']);
    return false;
  }
};

export const CanActivate2 = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.IsAdmin()) {
    return true;
  } else {
    alert('You are not authorized!!');
    router.navigate(['/login']);
    return false;
  }
};
