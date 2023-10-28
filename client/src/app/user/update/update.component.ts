import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  updateForm: FormGroup;
  res: Subscription;
  localUsername = localStorage.getItem('username');
  username;
  email;
  constructor(
    // public authService: AuthService,
    private http: HttpClient // ,private router: Router // private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  errorVal: String;

  onSubmit() {
    console.log('in');
    const username = this.updateForm.value.username;
    const email = this.updateForm.value.email;
    console.log('submit', username, email);
    const res = this.http.patch(
      `http://localhost:3000/user/${this.localUsername}`,
      {
        username,
        email,
      }
    );
    res.subscribe({
      next: (res) => {
        console.log(res);
        //     if (this.loginForm.value.username === 'Admin') {
        //       this.router.navigate(['/admin']);
        //       this.authService.isAdmin = true;
        //     } else {
        //       this.router.navigate(['/user']);
        //       this.authService.isAuthenticated = true;
        //     }
        //     localStorage.setItem('username', this.loginForm.value.username);
      },
      error: (error) => {
        console.log(error.message);
        this.errorVal = error.message;
      },
    });
  }
}
