import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

// import { NgForm } from '@angular/forms';
// import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userid;
  role;
  constructor(
    public authService: AuthService,
    public router: Router // private recaptchaV3Service: ReCaptchaV3Service
  ) {}
  ngOnInit() {
    this.authService.autoLogin();
    this.authService.getuserid().subscribe((res) => {
      this.userid = res['userid'];
      this.authService.getrole(this.userid).subscribe((response) => {
        this.role = response;
        localStorage.setItem('role', this.role.role);
        if (this.role.role === 'ADMIN') {
          this.router.navigate['/admin'];
          this.authService.isAdmin = true;
        } else if (this.role.role === 'USER') {
          console.log('checking');
          this.authService.isAuthenticated = true;
          this.router.navigate['/user'];
        }
      });
    });
  }
}

// this.recaptchaV3Service
//   .execute('importantAction')
//   .subscribe((token: string) => {
//     console.debug(`Token [${token}] generated`);
//   });
//   }
// }
