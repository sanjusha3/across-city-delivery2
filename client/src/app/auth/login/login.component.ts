import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  res: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.activatedRoute.queryParamMap.subscribe((queries) => {
      const logout = Boolean(queries.get('logout'));
      if (logout) {
        this.authService.logoutUser();
        alert(
          'You are now logged out!.IsAuthenticated =' +
            this.authService.isAuthenticated
        );
      }
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
