import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  @Input()
  username: String;
  // username;
  updateForm: FormGroup;
  res: Subscription;
  // localUsername = localStorage.getItem('username');
  // email;
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
    const res = this.http.patch(`http://localhost:3000/user/${this.username}`, {
      username,
      email,
    });
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
