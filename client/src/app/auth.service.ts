import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject } from 'rxjs';
import { User } from './auth/user.model';
const localUsername = localStorage.getItem('username');
const localRole = localStorage.getItem('role');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: Boolean = false;
  isAdmin: Boolean = false;
  userData: Object;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}
  createUser(username: string, email: string, password: string) {
    return this.http.post('http://localhost:3000/signup', {
      username,
      email,
      password,
    });
  }
  createUserA(username: string, email: string, password: string) {
    return this.http.post('http://localhost:3000/admin/user', {
      username,
      email,
      password,
    });
  }
  loginUser(username: string, password: string) {
    return this.http.post('http://localhost:3000/login', {
      username,
      password,
    });
  }

  logoutUser() {
    // console.log("hhhhhhhhhhh");
    
    this.http.get('http://localhost:3000/logout').subscribe((res) => {
      console.log(res);
    });

    console.log("you're logged out");
    this.isAuthenticated = false;
    this.isAdmin = false;

    localStorage.clear();
    // console.log(this.isAuthenticated);
    // console.log(this.isAdmin);
  }

  getuserid() {
    return this.http.get('http://localhost:3000/userid');
  }

  getrole(userid) {
    return this.http.get(`http://localhost:3000/userrole/${userid}`);
  }

  verify(extData) {
    return this.http.post('http://localhost:3000/verify', extData);
  }

  autoLogin() {
    const localRole = localStorage.getItem('role');
    if (localRole === 'ADMIN') {
      // console.log('localrole is admin');
      this.isAdmin = true;
    } else if (localRole === 'USER') {
      // console.log('localrole is user');
      this.isAuthenticated = true;
    }
  }

  IsAuthenticated() {
    return this.isAuthenticated;
  }

  IsAdmin() {
    return this.isAdmin;
  }
}
