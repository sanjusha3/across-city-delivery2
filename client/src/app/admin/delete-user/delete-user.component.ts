import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css'],
})
export class DeleteUserComponent {
  @Input()
  id: any;

  constructor(
    // public authService: AuthService,
    private http: HttpClient // ,private router: Router // private activatedRoute: ActivatedRoute
  ) {}

  onSubmit() {
    console.log();
    console.log('in delete');
    console.log(this.id);
    const response = this.http.delete(
      `http://localhost:3000/admin/user/${this.id}`
    );
    response.subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }
}
