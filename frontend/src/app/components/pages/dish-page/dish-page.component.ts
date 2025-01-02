import { PostIngredient } from '../../../share/models/postIngredient';
import { ActivatedRoute } from '@angular/router';
import { DishService } from '../../../services/dish.service';
import { Component, OnInit } from '@angular/core';
import { Dish, Step } from 'src/app/share/models/Dish';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dish-page',
  templateUrl: './dish-page.component.html',
  styleUrls: ['./dish-page.component.css'],
})
export class DishPageComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private authService: AuthService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) {}
  dish!: Dish;
  user: any;
  postIngredient!: PostIngredient[];
  previewImage: string | null = null;
  isPermision: boolean = true;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    const dishId = this.activatedRoute.snapshot.paramMap.get('dishId');
    if (dishId) {
      this.getDishById(dishId);
      this.getIngredientByDishId(dishId);
    }
  }
  openPreview(preview: string) {
    this.previewImage = preview;
  }

  closePreview() {
    this.previewImage = null;
  }
  isLogin(): boolean {
    if (!this.user || Object.keys(this.user).length === 0) {
      return false;
    }
    return true;
  }

  getDishById(dishId: string): void {
    if (!this.isLogin()) {
      this.dishService.getDishById(dishId).subscribe({
        next: (dish) => {
          this.dish = dish;
          console.log(this.dish);
        },
        error: (error) => {
          if (error.status === 403) {
            this.isPermision = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Có lỗi xảy ra!',
            });
          } else {
            console.log(error);
          }
        },
      });
      return;
    }

    this.dishService
      .getDetailDishByUser(dishId, this.user.data[0].MaKhachHang)
      .subscribe({
        next: (dish) => {
          this.dish = dish;
          console.log(this.dish);
        },
        error: (error) => {
          if (error.status === 403) {
            this.isPermision = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Có lỗi xảy ra!',
            });
          } else {
            console.log(error);
          }
        },
      });
  }
  getIngredientByDishId(dishId: string): void {
    this.dishService.getIngredientById(dishId).subscribe({
      next: (ingredients) => {
        console.log(ingredients);
        this.postIngredient = ingredients;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
