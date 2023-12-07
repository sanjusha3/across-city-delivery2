
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { CustomvalidationService } from '../../customvalidation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private customValidator: CustomvalidationService,
    private toastr: ToastrService
  ) {}
  isEdit: Boolean = false;
  ordersArray: any;
  selectedId: string;
  orderForm: FormGroup;
  updateForm: FormGroup;
  res: Subscription;
  // userForm: FormGroup;
  res2: Subscription;
  errorVal2: string;
  orderCreated: Boolean = false;
  doesntExist: Boolean = false;
  p: number = 1;
  itemsPerPage: number = 10;
  get totalItems() {
    if(this.ordersArray){
    return this.ordersArray.length;}
  }
  user;
  // totalItems: number ;
  ngOnInit() {
    // this.isEdit = false;

    this.getOrders();
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
    this.updateForm = new FormGroup({
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
    // this.userForm = new FormGroup({
    //   username: new FormControl(null, [
    //     Validators.required,
    //     Validators.minLength(5),
    //   ]),
    //   email: new FormControl(null, [Validators.required, Validators.email]),
    //   password: new FormControl(null, [
    //     Validators.required,
    //     Validators.minLength(8),
    //     this.customValidator.patternValidator(),
    //   ]),
    // });
  }
  isDuplicate: Boolean = false;
  errorVal: String;
  userName;
  // onDelete() {
  //   console.log(this.selectedId);
  //   const response = this.http.delete(
  //     `http://localhost:3000/user/order/${this.selectedId}`
  //   );
  //   response.subscribe({
  //     next: (res) => {
  //       console.log(res);

  //       this.getOrders();
  //       this.toastr.success('Order Deleted!');
  //     },
  //     error: (error) => {
  //       console.log(error.error);
  //     },
  //   });
  // }
  // handleUpdate(itemName: String, itemWeight: Number, pickupAddress: String, dropAddress: String) {
  //   console.log(itemName, itemWeight, pickupAddress, dropAddress);
  //   this.isEdit = true;
  //   this.updateForm.setValue({
  //     itemName, itemWeight, pickupAddress, dropAddress,
  //   });
  // }
  // onUpdate() {
  //   const itemName = this.updateForm.value.itemName;
  //   const itemWeight = this.updateForm.value.itemWeight;
  //   const pickupAddress = this.updateForm.value.pickupAddress;
  //   const dropAddress = this.updateForm.value.dropAddress;

  //   // console.log('submit', username, email);
  //   const res = this.http.patch(
  //     `http://localhost:3000/user/order/${this.selectedId}`,
  //     {
  //       itemName, itemWeight, pickupAddress, dropAddress
  //     }
  //   );
  //   res.subscribe({
  //     next: (res) => {
  //       // console.log(res);

  //       this.getOrders();
  //       this.toastr.success('Order Details Updated!');
  //     },
  //     error: (error) => {
  //       // console.log(error);
  //       // console.log(error.error);

  //       this.toastr.error(error.error);

  //       // const element = document.getElementById(
  //       //   'exampleModalToggle'
  //       // ) as HTMLElement;
  //       // const myModal = new Modal(element);
  //       // myModal.show();
  //     },
  //   });
  // }
  // onCreateOrder() {
  //   console.log(this.orderForm);
  //   const res2 = this.authService.createUserA(
  //     this.orderForm.value.username,
  //     this.orderForm.value.email,
  //     this.orderForm.value.password
  //   );

  //   res2.subscribe({
  //     next: (res2) => {
  //       // console.log(res2);

  //       this.toastr.success(res2['message']);
  //       this.router.navigate(['/admin']);
  //       this.getOrders();
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error);

  //       // const element = document.getElementById('addUserModal') as HTMLElement;
  //       // const myModal = new Modal(element);
  //       // myModal.show();
  //     },
  //   });
  // }

  // onChangedPage(pageData: PageEvent) {
  //   console.log(pageData);
  // }

  ordercreated() {
    return this.orderCreated;
  }

  getOrders() {
    console.log('in get orders');
    this.http.get('http://localhost:3000/user/order').subscribe((res) => {
      console.log(res);
      this.ordersArray = res;
      // this.totalItems = ordersArray.length
    });
    
  }
  
  // setSelectedId(id: string) {
  //   this.selectedId = id;
  // }

  // getUsername(){
  //   console.log('in get username');
  //   const response = this.http.get(
  //     `http://localhost:3000/user/${this.selectedId}`
  //   );
  //   response.subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       // this.isloading = false;

  //       this.user = res;
  //       this.userName = this.user.username;
  //       return this.userName
  //       // console.log(this.username);
  //       // this.email = this.user.email;
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //     },
  //   });
    // this.http.get(`http://localhost:3000/username/${this.selectedId}`).subscribe((res) => {
    //   console.log(res);
    //   this.user = res;
    //   return res;
    //   // this.totalItems = ordersArray.length
    // });
  // }

  

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

  onCreateOrder() {
    console.log(this.orderForm);
    // console.log(this.orderForm.value.itemName)
    // console.log(this.user)
    const that = this;
    // this.user = this.getUsername();
    const itemName = this.orderForm.value.itemName;
    const itemWeight = this.orderForm.value.itemWeight;
    const pickupAddress = this.orderForm.value.pickupAddress;
    const dropAddress = this.orderForm.value.dropAddress;

    // console.log('submit', username, email);
    const res = this.http.post(
      'http://localhost:3000/user/order',
      {
        itemName, itemWeight, pickupAddress, dropAddress
      }
    );

    res.subscribe({
      next: (res) => {
        console.log(res);

        // this.getOrders();
        this.toastr.success(res['message']);
        // this.toastr.success('Order Details Updated!');
      },
      error: (error) => {
        // console.log(error);
        // console.log(error.error);

        this.toastr.error(error);

        // const element = document.getElementById(
        //   'exampleModalToggle'
        // ) as HTMLElement;
        // const myModal = new Modal(element);
        // myModal.show();
      },
    });






    //order create API
    // const res = this.createOrder(
    //   this.orderForm.value.itemName,
    //   this.orderForm.value.itemWeight,
    //   this.orderForm.value.pickupAddress,
    //   this.orderForm.value.dropAddress
    // );

    // res.subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     if (res !== '') {
    //       that.toastr.success(res['message']);
    //       // that.router.navigate(['/user']);
    //     }
    //   },
    //   error: (error) => {
    //     console.log(error.message);
    //     console.log(error);
    //     // that.errorVal = error['error'];
    //     that.toastr.error(error);
    //   },
    // });
  }
}





























//  implements OnInit {
//   orderForm: FormGroup;
//   res: Subscription;
//   data;
//   // res2;

//   ngOnInit() {
//     this.orderForm = new FormGroup({
//       itemName: new FormControl(null, [
//         Validators.required,
//         Validators.minLength(3),
//       ]),
//       itemWeight: new FormControl(null, Validators.required),
//       pickupAddress: new FormControl(null, [
//         Validators.required,
//         Validators.minLength(8),
//       ]),
//       dropAddress: new FormControl(null, [
//         Validators.required,
//         Validators.minLength(8),
//       ]),
//     });
  // }

  // constructor(
  //   // public authService: AuthService,
  //   private http: HttpClient,
  //   private router: Router,
  //   // private customValidator: CustomvalidationService,
  //   private toastr: ToastrService
  // ) {}
  // errorVal: string;

  // createOrder(
  //   itemName: String,
  //   itemWeight: Number,
  //   pickupAddress: String,
  //   dropAddress: String
  // ) {
  //   return this.http.post('http://localhost:3000/user/order', {
  //     itemName,
  //     itemWeight,
  //     pickupAddress,
  //     dropAddress,
  //   });
  // }

  // onSubmit() {
  //   console.log(this.orderForm);
  //   const that = this;

  //   //order create API
  //   const res = this.createOrder(
  //     this.orderForm.value.itemName,
  //     this.orderForm.value.itemWeight,
  //     this.orderForm.value.pickupAddress,
  //     this.orderForm.value.dropAddress
  //   );

  //   res.subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if (res !== '') {
  //         that.toastr.success(res['message']);
  //         that.router.navigate(['/user']);
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error.message);
  //       console.log(error);
  //       // that.errorVal = error['error'];
  //       that.toastr.error(error);
  //     },
  //   });
  // }
// }
