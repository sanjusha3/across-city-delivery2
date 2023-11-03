import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
// const localemail = localStorage.getItem('username');
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // localUsername = localStorage.getItem('username');
  update2Form: FormGroup;
  res: Subscription;
  user;
  role;
  userid;
  email;
  username;
  isloading: Boolean;
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.authService.autoLogin();
    this.getUser();
    this.update2Form = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  errorVal: String;

  getUser() {
    this.authService.getuserid().subscribe((response) => {
      console.log(response['userid']);
      this.userid = response['userid'];
      this.authService.getrole(this.userid).subscribe((response) => {
        // return response;
        console.log(response);
        this.role = response;
        localStorage.setItem('role', this.role.role);
        // if (this.role === 'ADMIN') {
        //   console.log('youre the admin');
        //   this.authService.isAdmin = true;
        //   this.router.navigate(['/admin']);
        // } else if (this.role === 'USER') {
        //   this.authService.isAuthenticated = true;
        //   this.router.navigate(['/user']);
        // }
      });
    });
    this.isloading = true;
    this.authService.getuserid().subscribe((res) => {
      this.userid = res['userid'];
      const response = this.http.get(
        `http://localhost:3000/user/${this.userid}`
      );
      response.subscribe({
        next: (res) => {
          console.log(res);
          this.isloading = false;

          this.user = res;
          this.username = this.user.username;
          console.log(this.username);
          this.email = this.user.email;
        },
        error: (error) => {
          console.log(error.message);
        },
      });
    });
  }
  onUpdate() {
    console.log('in');
    const username = this.update2Form.value.username;
    const email = this.update2Form.value.email;
    console.log('submit', username, email);
    this.authService.getuserid().subscribe((res) => {
      this.userid = res['userid'];
      const response = this.http.patch(
        `http://localhost:3000/user/${this.userid}`,
        {
          username,
          email,
        }
      );
      response.subscribe({
        next: (res) => {
          console.log(res);
          this.getUser();
          this.toastr.success('Your details are updated!');
        },
        error: (error) => {
          console.log(error.error.error);
          this.errorVal = error.error.error;
          this.toastr.error(error.error.error);
          const element = document.getElementById(
            'exampleModalToggle'
          ) as HTMLElement;
          const myModal = new Modal(element);
          myModal.show();
        },
      });
    });
  }
}
