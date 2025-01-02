import { AuthService } from 'src/app/services/auth.service';
import { Dish } from 'src/app/share/models/Dish';
import { DishService } from 'src/app/services/dish.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dish-paid',
  templateUrl: './dish-paid.component.html',
  styleUrls: ['./dish-paid.component.css'],
})
export class DishPaidComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  dishes: Dish[] = [];
  user: any;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.getAllDishesPaid();
  }

  getAllDishesPaid(): void {
    this.dishService.getAllDishByUser(this.user.data[0].MaKhachHang).subscribe({
      next: (response) => {
        const data: Dish[] = response;
        console.log(data);
        this.dishes = data.filter((item) => item.TrangThai === 'Ðã Mua');
        console.log(this.dishes);
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
  isLogin(): boolean {
    if (!this.user || Object.keys(this.user).length === 0) {
      return false;
    }
    return true;
  }
}
