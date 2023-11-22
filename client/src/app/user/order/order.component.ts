import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
// import { CustomvalidationService } from '../customvalidation.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  res: Subscription;
  data;
  // res2;

  ngOnInit() {
    this.orderForm = new FormGroup({
      itemName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      itemWeight: new FormControl(null, Validators.required),
      pickupAddress: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      dropAddress: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  constructor(
    // public authService: AuthService,
    private http: HttpClient,
    private router: Router,
    // private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}
  errorVal: string;

  createOrder(
    itemName: String,
    itemWeight: Number,
    pickupAddress: String,
    dropAddress: String
  ) {
    return this.http.post('http://localhost:3000/user/order', {
      itemName,
      itemWeight,
      pickupAddress,
      dropAddress,
    });
  }

  onSubmit() {
    console.log(this.orderForm);
    const that = this;

    //order create API
    const res = this.createOrder(
      this.orderForm.value.itemName,
      this.orderForm.value.itemWeight,
      this.orderForm.value.pickupAddress,
      this.orderForm.value.dropAddress
    );

    res.subscribe({
      next: (res) => {
        console.log(res);
        if (res !== '') {
          that.toastr.success(res['message']);
          that.router.navigate(['/user']);
        }
      },
      error: (error) => {
        console.log(error.message);
        console.log(error);
        // that.errorVal = error['error'];
        that.toastr.error(error);
      },
    });
  }
}
