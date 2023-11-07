import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  update2Form: FormGroup;
  res: Subscription;
  isEdit: Boolean = false;
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
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  errorVal: String;

  getUser() {
    this.authService.getuserid().subscribe((response) => {
      console.log(response['userid']);
      this.userid = response['userid'];
      this.authService.getrole(this.userid).subscribe((response) => {
        console.log(response);
        this.role = response;
        localStorage.setItem('role', this.role.role);
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

  handleUpdate() {
    this.isEdit = true;
    this.update2Form.setValue({
      username: this.username,
      email: this.email,
    });
  }
  // prepopulate() {
  //   console.log(this.email);
  //   this.update2Form.value.username.setValue(this.username);
  //   this.update2Form.value.email.setValue(this.email);
  // }
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
          console.log(error.error);
          // this.errorVal = error.error;
          this.toastr.error(error.error);
          // const element = document.getElementById(
          //   'exampleModalToggle'
          // ) as HTMLElement;
          // const myModal = new Modal(element);
          // myModal.show();
        },
      });
    });
  }
}
