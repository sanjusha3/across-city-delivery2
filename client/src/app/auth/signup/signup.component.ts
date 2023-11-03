import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { CustomvalidationService } from '../customvalidation.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  res: Subscription;
  data;
  // res2;

  ngOnInit() {
    this.authService.autoLogin();
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.customValidator.patternValidator(),
      ]),
    });
  }

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private customValidator: CustomvalidationService
  ) {}
  errorVal: string;

  onSubmit() {
    console.log(this.signupForm);
    const res = this.authService.createUser(
      this.signupForm.value.username,
      this.signupForm.value.email,
      this.signupForm.value.password
    );
    res.subscribe({
      next: (res) => {
        console.log(res);
        if (res != '') {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.log(error.message);
        this.errorVal = error.message;
      },
    });
    // const data = null;
    const that = this;
    let extData;
    grecaptcha.ready(function () {
      // grecaptcha
      //   .execute('reCAPTCHA_site_key', { action: 'submit' })
      //   .then(function (token) {
      //     // Add your logic to submit to your backend server here.
      //   });
      grecaptcha
        .execute('6LdRv94oAAAAAN9XW6y9n8H0p_6QLNPQb9GXwFql', {
          action: 'signup',
        })
        .then(function (token) {
          console.log('something', that.signupForm);
          const username = that.signupForm.value.username;
          console.log(username);
          const email = that.signupForm.value.email;
          const password = that.signupForm.value.password;
          const captcha = token;
          console.log(captcha);
          console.log('this is captcha');
          // console.log(username, email, password, captcha);
          const data = {
            username,
            email,
            password,
            captcha,
          };
          extData = data;
          that.authService.verify(extData).subscribe((response) => {
            console.log(response['msg']);
          });
        });
      console.log('something');
      console.log(extData);
      // const sub = that.http.post('http://localhost:3000/verify', extData)
      //     .then((res) => {
      //       console.log(res['data']);
      //       const response = res['data'];
      //       alert('msg:' + response.msg + ',score:' + response.score);
      //     })
      //     .catch((error) => {
      //       console.log(error.message);
      //     });
      // });

      // sub.subscribe({
      //   next: (res) => {
      //     console.log(res);
      //     const response = res;
      //     // alert(response);
      //     // alert('msg:' + response.msg + ',score:' + response.score);
      //     error: (error) => {
      //       console.log(error);
      //       // this.errorVal = error.message;
      //     };
      //   },
      // });
    });
  }
}
// sendData(username, email, password, captcha) {
// const info = JSON.stringify({
//   userName: username,
//   Email: email,
//   Password: password,
//   Captcha: captcha,
// });

// runCaptcha() {

// }
// runVerify() {
// this.signupForm.preventDefault();
// grecaptcha.execute('', { action: 'signup' }).then(function (token) {
//   const username = this.signupForm.value.username;
//   const email = this.signupForm.value.email;
//   const password = this.signupForm.value.password;
//   const captcha = token;
//   const res2 = this.http.post('http://localhost:3000/verify', {
//     username,
//     email,
//     password,
//     captcha,
//   });
//   res2.subscribe({
//     next: (res) => {
//       console.log(res);
//       res.json();
//       alert('msg:' + res.msg + ',score:' + res.score);
//     },
//     error: (error) => {
//       console.log(error.message);
//     },
//   });
// });

// }

// function onSubmit(token) {
//   document.getElementById("demo-form").submit();
// }

// grecaptcha.execute('', { action: 'signup' }).then(function (token) {
//   const username = this.signupForm.value.username;
//   const email = this.signupForm.value.email;
//   const password = this.signupForm.value.password;
//   const captcha = token;
//   console.log(captcha);

//   const res2 = this.http.post('http://localhost:3000/verify', {
//     username,
//     email,
//     password,
//     captcha,
//   });
//   res2
//     .then((res) => {
//       console.log(res);
//       res.json();
//       alert('msg:' + res.msg + ',score:' + res.score);
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// });
