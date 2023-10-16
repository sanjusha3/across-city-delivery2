import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, BehaviorSubject } from 'rxjs';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: Boolean = false;
  isAdmin: Boolean = false;

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}
  createUser(username: string, email: string, password: string) {
    console.log('in');
    return this.http
      .post('http://localhost:3000/signup', {
        username,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }
  loginUser(username: string, password: string) {
    console.log('in');
    return this.http
      .post('http://localhost:3000/login', {
        username,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  logoutUser() {
    this.http.get('http://localhost:3000/logout');
    this.user.next(null);
    this.router.navigate(['/login']);
    console.log("you're logged out");
    this.isAuthenticated = false;
    this.isAdmin = false;
    localStorage.clear();
    console.log(this.isAuthenticated);
    console.log(this.isAdmin);
  }
  private handleError(errorRes) {
    console.log('error', errorRes.error.error);
    return throwError(() => new Error(errorRes.error.error));
  }

  IsAuthenticated() {
    return this.isAuthenticated;
  }

  IsAdmin() {
    return this.isAdmin;
  }
}
