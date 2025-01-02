import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from './../../../services/payment.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
})
export class PaymentHistoryComponent implements OnInit {
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  user: any;
  paymentHistory: any;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.getPaymentHistory();
  }

  getPaymentHistory(): void {
    this.paymentService
      .getHistoryByUser(this.user.data[0].MaKhachHang)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.paymentHistory = response.invoices;
          console.log(this.paymentHistory);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
