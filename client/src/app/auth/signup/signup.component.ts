import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CustomvalidationService } from '../../customvalidation.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  res: Subscription;
  data;
  declare grecaptcha: any;
  // res2;

  ngOnInit() {
    this.authService.autoLogin();
    this.signupForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.customValidator.patternValidator(),
      ]),
      // captcha: new FormControl(null, Validators.required),
    });
  }

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {}
  errorVal: string;

  onSubmit() {
    console.log(this.signupForm);
    const that = this;

    this.reCaptchaV3Service.execute('signup').subscribe((token: string) => {
      console.debug(`Token [${token}] generated`);

      console.log('something', that.signupForm);
      const username = that.signupForm.value.username;
      console.log(username);
      const email = that.signupForm.value.email;
      const password = that.signupForm.value.password;
      const captcha = token;
      console.log(captcha);
      console.log('this is captcha');
      const data = {
        username,
        email,
        password,
        captcha,
      };
      let extData = data;
      that.authService.verify(extData).subscribe({
        next: (response) => {
          console.log(response);

          console.log(response['message']);
          // that.toastr.success(response['message']);

          //user create API
          const res = this.authService.createUser(
            this.signupForm.value.username,
            this.signupForm.value.email,
            this.signupForm.value.password
          );

          res.subscribe({
            next: (res) => {
              console.log(res);
              if (res !== '') {
                that.toastr.success(res['message']);
                that.toastr.success(response['message']);
                that.router.navigate(['/login']);
              }
            },
            error: (error) => {
              // console.log(error.message);
              // console.log(error.error);
              // that.errorVal = error['error'];
              that.toastr.error(error.error);
            },
          });
        },
        error: (error) => {
          // console.log(error);
          // that.errorVal = error.message;
          that.toastr.error(error.error);
        },
      });
    });
  }
}
