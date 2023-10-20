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
    console.log(this.usersArray);
  }

  // usersArray = this.getUsers();

  getUsers() {
    console.log('in get users');
    const response = this.http.get('http://localhost:3000/admin/user');
    response.subscribe({
      next: (res) => {
        console.log(res);
        this.usersArray = res;
        console.log(this.usersArray);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }
}
