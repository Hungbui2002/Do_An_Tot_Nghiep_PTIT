import { PaymentService } from 'src/app/services/payment.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.getAllInvoice();
  }

  invoices: any;
  totalInvoice: number = 0;

  getAllInvoice(): void {
    this.paymentService.getAllInvoice().subscribe(
      (response) => {
        this.invoices = response;
        console.log(this.invoices);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'có lỗi xảy ra',
        });
      }
    );
  }
}
