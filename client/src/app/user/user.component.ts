import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { AuthService } from './auth/auth.service';

// const localemail = localStorage.getItem('username');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  localUsername = localStorage.getItem('username');
  user;
  username;
  email;
  constructor(private http: HttpClient) {} // public authService: AuthService
  ngOnInit() {
    this.getUser();
  }

  getUser() {
    // console.log('in get user by username');
    const response = this.http.get(
      `http://localhost:3000/user/${this.localUsername}`
    );
    response.subscribe({
      next: (res) => {
        console.log('res');
        this.user = res;
        this.username = this.user.username;
        this.email = this.user.email;
        console.log(this.user);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }
}
