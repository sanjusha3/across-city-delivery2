import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
const localUsername = localStorage.getItem('username');

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

// export const CanActivate3 = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const localUsername = localStorage.getItem('username');
//   console.log(localUsername);
//   if (localUsername) {
//     if (localUsername === 'Admin') {
//       if (authService.IsAdmin()) {
//         console.log('hi admin');
//         return true;
//       } else {
//         alert('You are not authorized!!');
//         router.navigate(['/login']);
//         return false;
//       }
//     } else {
//       if (authService.IsAuthenticated()) {
//         return true;
//       } else {
//         alert('You are not authorized!!');
//         router.navigate(['/login']);
//         return false;
//       }
//     }
//   }
//   console.log('false');
//   return false;
// };
// if (authService.IsAdmin()) {
//   return true;
// } else {
//   alert('You are not authorized!!');
//   router.navigate(['/login']);
//   return false;
// }
