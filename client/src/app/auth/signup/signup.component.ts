import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { CustomvalidationService } from '../customvalidation.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  res: Subscription;
  // res2;

  ngOnInit() {
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
      },
      error: (error) => {
        console.log(error.message);
        this.errorVal = error.message;
      },
    });
    const that = this;
    grecaptcha
      .execute('6LcKzMEoAAAAANbuFEHx630FMCUwrseEguu7ixtP', { action: 'signup' })
      .then(function (token) {
        console.log('something', that.signupForm);
        const username = that.signupForm.value.username;
        console.log(username);
        const email = that.signupForm.value.email;
        const password = that.signupForm.value.password;
        const captcha = token;
        console.log(captcha);

        const data = {
          username,
          email,
          password,
          captcha,
        };

        const sub = that.http.post('http://localhost:3000/verify', data);
        //     then((res) => {
        //       console.log(res.data);
        //       const response = res.data;
        //       alert('msg:' + response.msg + ',score:' + response.score);
        //     })
        //     .catch((error) => {
        //       console.log(error.message);
        //     });
        // });

        sub.subscribe({
          next: (res) => {
            console.log(res);
            const response = res;
            // alert(response);
            // alert('msg:' + response.msg + ',score:' + response.score);
            error: (error) => {
              console.log(error);
              // this.errorVal = error.message;
            };
          },
        });
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
