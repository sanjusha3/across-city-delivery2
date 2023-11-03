import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../auth/user.model';
const localUsername = localStorage.getItem('username');
const localRole = localStorage.getItem('role');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: Boolean = false;
  isAdmin: Boolean = false;
  // IsLogin: Boolean = false;
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
    console.log('in');
    return this.http
      .post('http://localhost:3000/signup', {
        username,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }
  createUserA(username: string, email: string, password: string) {
    console.log('in');
    // if(username===''|| email==='' || password ===''){

    // }
    return this.http
      .post('http://localhost:3000/admin/user', {
        username,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }
  loginUser(username: string, password: string) {
    console.log('in');
    // this.loggedIn.next(true);
    // console.log('before login' + this.isLoggedIn);
    return this.http
      .post('http://localhost:3000/login', {
        username,
        password,
      })

      .pipe(catchError(this.handleError));
  }

  logoutUser() {
    this.http.get('http://localhost:3000/logout').subscribe((res) => {
      console.log(res);
    });

    // this.loggedIn.next(false);
    // this.user.next(null);
    // this.router.navigate(['/login']);
    console.log("you're logged out");
    this.isAuthenticated = false;
    this.isAdmin = false;
    // this.IsLogin = false;
    localStorage.clear();
    console.log(this.isAuthenticated);
    console.log(this.isAdmin);
  }
  setloggedin() {
    // this.loggedIn.next(true);
  }
  private handleError(errorRes) {
    // console.log('error', errorRes.error.error);
    return throwError(() => new Error(errorRes.error.error));
  }

  getuserid() {
    console.log('in');
    return this.http.get('http://localhost:3000/userid');
  }

  getrole(userid) {
    console.log('in get user role');
    return this.http.get(`http://localhost:3000/userrole/${userid}`);
  }

  verify(extData) {
    return this.http.post('http://localhost:3000/verify', extData);
    // .then((res) => {
    //   console.log(res['data']);
    //   const response = res['data'];
    //   alert('msg:' + response.msg + ',score:' + response.score);
    // })
    // .catch((error) => {
    //   console.log(error.message);
    // });
    // });

    // sub.subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     const response = res;
    //     // alert(response);
    //     // alert('msg:' + response.msg + ',score:' + response.score);
    //     error: (error) => {
    //       console.log(error);
    //       // this.errorVal = error.message;
    //     };
    //   },
    // });
  }

  // autoLogin() {
  //   if (localUsername === 'Admin') {
  //     this.router.navigate(['/admin']);
  //   } else {
  //     this.router.navigate(['/user']);
  //   }
  // }
  // setLoggedIn(value: boolean) {
  //   this.loggedIn.next(value);
  // }

  autoLogin() {
    const localRole = localStorage.getItem('role');
    if (localRole === 'ADMIN') {
      console.log('localrole is admin');
      this.isAdmin = true;
      this.router.navigate(['/admin']);
      // this.IsLogin = true;
    } else if (localRole === 'USER') {
      console.log('localrole is user');
      this.isAuthenticated = true;
      this.router.navigate(['/user']);
      // this.IsLogin = true;
    }
  }

  IsAuthenticated() {
    return this.isAuthenticated;
  }

  IsAdmin() {
    return this.isAdmin;
  }

  // IsLogin() {
  //   return this.isAuthenticated || this.isAdmin;
  // }
}
