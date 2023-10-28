import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}
  usersArray: any;
  ngOnInit() {
    this.getUsers();
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

  // onDelete(id) {
  //   console.log(id);
  //   console.log('in delete');
  //   const response = this.http.delete(`http://localhost:3000/admin/user/${id}`);
  //   response.subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     },
  //   });
  // }

  // onUpdate(id) {
  //   console.log(id);
  //   console.log('in update');
  // const response = this.http.update(`http://localhost:3000/admin/user/${id}`);
  // response.subscribe({
  //   next: (res) => {
  //     console.log(res);
  //   },
  //   error: (error) => {
  //     console.log(error.message);
  //   },
  //   });
  // }
}
