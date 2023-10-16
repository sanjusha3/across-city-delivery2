import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  res: Subscription;

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  constructor(public authService: AuthService) {}
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
  }
}
