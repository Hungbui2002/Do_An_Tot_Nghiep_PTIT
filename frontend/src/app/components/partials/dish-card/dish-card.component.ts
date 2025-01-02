import { AuthService } from 'src/app/services/auth.service';
import { Dish } from 'src/app/share/models/Dish';
import { Component, Input, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.css'],
})
export class DishCardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}
  @Input() dish!: Dish;
  @Input() isLogin: boolean = false;
  user: any;
  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
  }

  openConfirmDialog(dish: Dish): void {
    const dataSend = {
      MaMon: dish.MaMon,
      MaKhachHang: this.user.data[0].MaKhachHang,
      TenMon: dish.TenMon,
      Gia: dish.Gia,
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dataSend,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentService.createPayment(result).subscribe({
          next: (response) => {
            if (response.data.return_code === 1 && response.data.order_url) {
              window.location.href = response.data.order_url;
              console.log(response.data.order_url);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.return_message || 'Không thể tạo giao dịch!',
              });
            }
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Có lỗi xảy ra!',
            });
          },
        });
      }
    });
  }

  goToDishPage(dish: Dish): void {
    if (!this.isLogin) {
      if (dish.Gia == 0) {
        this.router.navigateByUrl('/dish/' + dish.MaMon);
      } else {
        this.router.navigateByUrl('auth/login');
      }
      return;
    }

    if (dish.Gia == 0 || dish.TrangThai == 'Ðã Mua') {
      this.router.navigateByUrl('/dish/' + dish.MaMon);
    } else if (dish.TrangThai == 'Chua Mua') {
      this.openConfirmDialog(dish);
    }
  }
}
