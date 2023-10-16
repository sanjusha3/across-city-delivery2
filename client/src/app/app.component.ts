import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
const localUsername = localStorage.getItem('username');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit() {
    if (localUsername) {
      if (localUsername === 'Admin') {
        this.authService.isAdmin = true;
      } else {
        this.authService.isAuthenticated = true;
      }
    }
    //check if there is username and password in localStorage
  }
}
