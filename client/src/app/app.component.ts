import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
// import { NgForm } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
const localUsername = localStorage.getItem('username');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}
  ngOnInit() {
    console.log(localUsername);

    if (localUsername) {
      if (localUsername === 'Admin') {
        this.authService.isAdmin = true;
      } else {
        this.authService.isAuthenticated = true;
      }
    }
  }
}
// public send(form: NgForm): void {
//   if (form.invalid) {
//     for (const control of Object.keys(form.controls)) {
//       form.controls[control].markAsTouched();
//     }
//     return;
//   }

// this.recaptchaV3Service
//   .execute('importantAction')
//   .subscribe((token: string) => {
//     console.debug(`Token [${token}] generated`);
//   });
//   }
// }
