import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CustomvalidationService } from '../auth/customvalidation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  theArray: Observable<string[]>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}
  isEdit: Boolean = false;
  usersArray: any;
  selectedId: string;
  updateForm: FormGroup;
  res: Subscription;
  userForm: FormGroup;
  res2: Subscription;
  errorVal2: string;
  userCreated: Boolean = false;
  doesntExist: Boolean = false;
  p: number = 1;
  itemsPerPage: number = 10;

  ngOnInit() {
    this.isEdit = false;
    this.theArray = new Observable((observer) => {
      observer.next(this.usersArray);
    });
    this.getUsers();
    this.updateForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.userForm = new FormGroup({
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
    });
  }
  isDuplicate: Boolean = false;
  errorVal: String;
  onDelete() {
    console.log(this.selectedId);
    const response = this.http.delete(
      `http://localhost:3000/admin/user/${this.selectedId}`
    );
    response.subscribe({
      next: (res) => {
        console.log(res);

        this.getUsers();
        this.toastr.success('User Deleted!');
      },
      error: (error) => {
        console.log(error.error);
      },
    });
  }
  handleUpdate(username, email) {
    console.log(username, email);
    this.isEdit = true;
    this.updateForm.setValue({
      username,
      email,
    });
  }
  onUpdate() {
    const username = this.updateForm.value.username;
    const email = this.updateForm.value.email;
    // console.log('submit', username, email);
    const res = this.http.patch(
      `http://localhost:3000/admin/user/${this.selectedId}`,
      {
        username,
        email,
      }
    );
    res.subscribe({
      next: (res) => {
        // console.log(res);

        this.getUsers();
        this.toastr.success('User Details Updated!');
      },
      error: (error) => {
        // console.log(error);
        // console.log(error.error);

        this.toastr.error(error.error);

        // const element = document.getElementById(
        //   'exampleModalToggle'
        // ) as HTMLElement;
        // const myModal = new Modal(element);
        // myModal.show();
      },
    });
  }
  onCreateUser() {
    console.log(this.userForm);
    const res2 = this.authService.createUserA(
      this.userForm.value.username,
      this.userForm.value.email,
      this.userForm.value.password
    );

    res2.subscribe({
      next: (res2) => {
        // console.log(res2);

        this.toastr.success(res2['message']);
        this.router.navigate(['/admin']);
        this.getUsers();
      },
      error: (error) => {
        this.toastr.error(error.error);

        // const element = document.getElementById('addUserModal') as HTMLElement;
        // const myModal = new Modal(element);
        // myModal.show();
      },
    });
  }
  usercreated() {
    return this.userCreated;
  }

  getUsers() {
    console.log('in get users');
    this.http.get('http://localhost:3000/admin/user').subscribe((res) => {
      console.log(res);
      this.usersArray = res;
    });
  }
  setSelectedId(id) {
    this.selectedId = id;
  }
}
