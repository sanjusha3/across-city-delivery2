import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
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
        console.log(res)
        console.log(res['_doc']);
        if (res['_doc'] && this.loginForm.value.username === 'Admin') {
          this.router.navigate(['/admin']);
          this.toastr.success('You are now logged in!');
          this.authService.isAdmin = true;
        } else if (res['_doc'] && this.loginForm.value.username !== 'Admin'){
          this.router.navigate(['/user']);
          this.toastr.success('You are now logged in!');
          this.authService.isAuthenticated = true;
        } else {
          this.toastr.error('Please enter valid credentials!');
        }
        // console.log("6767676767676");
        
        this.authService.getuserid().subscribe((response) => {
          console.log(response['userid']);
          this.userid = response['userid'];
          this.authService.getrole(this.userid).subscribe((response) => {
            console.log(response);
            this.role = response;
            console.log(this.role);
            console.log('found role here',this.role.role );
            localStorage.setItem('role', this.role.role);
            // console.log('set value in local storage');
            
            console.log(localStorage.getItem('role'));
            // this.toastr.success('You are now logged in!');
            localStorage.setItem('username', this.loginForm.value.username);
          });
        });
        // this.toastr.success('You are now logged in!');
        // localStorage.setItem('username', this.loginForm.value.username);
      },
      error: (error) => {
        console.log(error);
        console.log(error.error);

        this.toastr.error(error.error);

        // this.toastr.error('Please enter valid credentials!');
        this.errorVal = error.error;
      },
    });
  }
}
