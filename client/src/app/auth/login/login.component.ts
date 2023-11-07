import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  res: Subscription;
  role;
  userid: String;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  // user: object;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    // this.authService.autoLogin();
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
        // console.log(res);
        if (this.loginForm.value.username === 'Admin') {
          this.router.navigate(['/admin']);
          this.authService.isAdmin = true;
        } else {
          this.router.navigate(['/user']);
          this.authService.isAuthenticated = true;
        }
        this.authService.getuserid().subscribe((response) => {
          // console.log(response['userid']);
          this.userid = response['userid'];
          this.authService.getrole(this.userid).subscribe((response) => {
            // console.log(response);
            this.role = response;
            console.log(this.role);
            console.log('found role here');
            localStorage.setItem('role', this.role.role);
            console.log(localStorage.getItem('role'));
          });
        });
        this.toastr.success('You are now logged in!');
        localStorage.setItem('username', this.loginForm.value.username);
      },
      error: (error) => {
        console.log(error.error);
        this.toastr.error('Please enter valid credentials!');
        this.errorVal = error.error;
      },
    });
  }
}
