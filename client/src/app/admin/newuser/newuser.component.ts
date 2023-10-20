import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent implements OnInit {
  userForm: FormGroup;
  res: Subscription;

  ngOnInit() {
    this.userForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  constructor(public authService: AuthService, private router: Router) {}
  errorVal: string;

  onSubmit() {
    console.log(this.userForm);
    const res = this.authService.createUserA(
      this.userForm.value.username,
      this.userForm.value.email,
      this.userForm.value.password
    );
    res.subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        console.log(error.message);
        this.errorVal = error.message;
      },
    });
  }
}
