import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CustomvalidationService } from '../auth/customvalidation.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit, DoCheck {
  theArray: Observable<string[]>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}
  usersArray: any;
  selectedId: string;
  updateForm: FormGroup;
  res: Subscription;
  userForm: FormGroup;
  res2: Subscription;
  errorVal2: string;
  userCreated: Boolean = false;
  doesntExist: Boolean = false;

  ngDoCheck() {
    // this.getUsers();
    this.doesntExist = false;
  }
  ngAfterViewInit() {
    // this.getUsers();
  }
  ngOnInit() {
    this.theArray = new Observable((observer) => {
      observer.next(this.usersArray);
    });
    // this.authService.autoLogin();
    this.getUsers();
    this.updateForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        this.customValidator.patternValidator(),
      ]),
    });
  }
  isDuplicate: Boolean = false;
  errorVal: String;
  onDelete() {
    console.log();
    console.log('in delete');
    console.log(this.selectedId);
    const response = this.http.delete(
      `http://localhost:3000/admin/user/${this.selectedId}`
    );
    response.subscribe({
      next: (res) => {
        console.log(res);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
        this.getUsers();
        this.toastr.success('User Deleted!');
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  onUpdate() {
    console.log('in');
    const username = this.updateForm.value.username;
    const email = this.updateForm.value.email;
    console.log('submit', username, email);
    const res = this.http.patch(
      `http://localhost:3000/admin/user/${this.selectedId}`,
      {
        username,
        email,
      }
    );
    res.subscribe({
      next: (res) => {
        console.log(res);

        this.getUsers();
        this.toastr.success('User Details Updated!');
        //     if (this.loginForm.value.username === 'Admin') {
        //       this.router.navigate(['/admin']);
        //       this.authService.isAdmin = true;
        //     } else {
        //       this.router.navigate(['/user']);
        //       this.authService.isAuthenticated = true;
        //     }
        //     localStorage.setItem('username', this.loginForm.value.username);
      },
      error: (error) => {
        console.log(error);
        console.log(error.error.error);
        this.errorVal = error.error.error;
        this.isDuplicate = true;
        this.toastr.error(error.error.error);

        const element = document.getElementById(
          'exampleModalToggle'
        ) as HTMLElement;
        const myModal = new Modal(element);
        myModal.show();
      },
    });
  }
  onCreateUser() {
    // this.doesntExist = true;
    console.log(this.userForm);
    const res2 = this.authService.createUserA(
      this.userForm.value.username,
      this.userForm.value.email,
      this.userForm.value.password
    );
    // this.doesntExist = true;
    res2.subscribe({
      next: (res2) => {
        console.log(res2);
        // alert(res2['data']);
        this.toastr.success(res2['data']);
        this.userCreated = true;
        this.router.navigate(['/admin']);
        this.getUsers();
        // this.doesntExist = false;
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      },
      error: (error) => {
        // this.doesntExist = true;
        console.log(error.message);
        this.errorVal2 = error.message;
        this.toastr.error(error.message);

        const element = document.getElementById('addUserModal') as HTMLElement;
        const myModal = new Modal(element);
        myModal.show();
      },
    });
  }
  usercreated() {
    return this.userCreated;
  }

  // usersArray = this.getUsers();

  getUsers() {
    console.log('in get users');
    this.http.get('http://localhost:3000/admin/user').subscribe(
      // {
      // next: (res) => {
      // console.log(res);
      // this.usersArray = res;
      // console.log(this.usersArray);
      // },
      // error: (error) => {
      // console.log(error.message);
      // },
      // }
      (res) => {
        console.log(res);
        this.usersArray = res;
      }
    );
  }
  setSelectedId(id) {
    this.selectedId = id;
  }
}
