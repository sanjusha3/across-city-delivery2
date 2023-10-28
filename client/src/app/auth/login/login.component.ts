import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  res: Subscription;
  // user: object;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  errorVal: String;

  onSubmit() {
    const res = this.authService.loginUser(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
    res.subscribe({
      next: (res) => {
        console.log(res);
        const user = this.authService.getuserid().subscribe((response) => {
          console.log(response);
        });
        console.log(user);
        // console.log(user['username']);
        if (this.loginForm.value.username === 'Admin') {
          this.router.navigate(['/admin']);
          this.authService.isAdmin = true;
        } else {
          this.router.navigate(['/user']);
          this.authService.isAuthenticated = true;
        }

        localStorage.setItem('username', this.loginForm.value.username);
      },
      error: (error) => {
        console.log(error.message);
        this.errorVal = error.message;
      },
    });
  }
}
