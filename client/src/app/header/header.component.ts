import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnChanges, DoCheck {
  // isLoggedIn = false;
  // toDisplay = true;

  // toggleData() {
  //   this.toDisplay = !this.toDisplay;
  // }
  loggedin: Boolean = false;
  localUsername = localStorage.getItem('username');
  constructor(public authService: AuthService, public toastr: ToastrService) {}
  ngOnInit() {
    // this.loggedin = this.authService.IsLogin;
    this.localUsername = localStorage.getItem('username');
    console.log(this.localUsername);
    //   this.authService.isAuthenticated || this.authService.isAdmin;
    // this.authService.isLoggedIn.subscribe((loggedIn) => {
    //   this.isLoggedIn = loggedIn;
    // });
  }
  ngDoCheck() {
    this.localUsername = localStorage.getItem('username');
    // console.log(this.localUsername);
  }
  ngOnChanges() {
    // this.localUsername = localStorage.getItem('username');
    // this.loggedin = this.authService.IsLogin;
  }

  Logout() {
    // console.log(
    //   'before logout' + this.isLoggedIn + this.authService.isLoggedIn
    // );
    console.log(this.authService.isAuthenticated || this.authService.isAdmin);
    if (this.authService.isAuthenticated || this.authService.isAdmin) {
      localStorage.clear();
      // this.toDisplay = false;
      this.localUsername = localStorage.getItem('username');
      // this.authService.IsLogin = false;
      // console.log(this.localUsername);
      // this.loggedin = this.authService.IsLogin;
      this.authService.logoutUser();
      // this.authService.IsLogin = false;
      this.toastr.success('You are now logged out!');
    }
  }
}
// loggedIn() {
//   // return this.authService.IsLogin;
// }
