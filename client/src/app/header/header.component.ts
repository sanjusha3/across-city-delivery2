import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  Logout() {
    if (this.authService.isAuthenticated || this.authService.isAdmin) {
      this.authService.logoutUser();
      alert('You are now logged out!');
    }
  }
}
