import { AuthService } from './../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Dish } from 'src/app/share/models/Dish';
import { DishService } from './../../../services/dish.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}
  dishes: Dish[] = [];
  evaluateDish: Dish[] = [];
  user: any;
  isSearching: boolean = false;
  searchTerm: string = '';
  totalPages: number = 0;
  currentPage: number = 1;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('search') || '';
      if (this.searchTerm) {
        this.isSearching = true;
        this.getDishByName(this.searchTerm);
      } else {
        this.isSearching = false;
        this.getAllDishLasted(this.currentPage);
      }
    });
    this.getPopularDishes();
  }
  isLogin(): boolean {
    if (!this.user || Object.keys(this.user).length === 0) {
      return false;
    }
    return true;
  }

  getAllDishLasted(page: number): void {
    this.dishes = [];
    if (!this.isLogin()) {
      this.dishService.getAllDishByPage(page).subscribe({
        next: (response) => {
          console.log(response);
          this.dishes = response.data;
          this.totalPages = response.totalPages;
          this.currentPage = page;
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
      return;
    }
    this.dishService
      .getAllDishByPageAndUser(this.user.data[0].MaKhachHang, page)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.dishes = response.data;
          this.totalPages = response.totalPages;
          this.currentPage = page;
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

  getDishByName(dishName: string): void {
    this.dishes = [];
    this.dishService.getDishByName(dishName).subscribe({
      next: (dishes) => {
        this.dishes = dishes;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Có lỗi xảy ra!',
        });
      },
    });
  }

  getPopularDishes(): void {
    this.evaluateDish = [];
    if (!this.isLogin()) {
      this.dishService.getAllDish().subscribe({
        next: (dishes) => {
          const data: Dish[] = dishes;
          this.evaluateDish = data
            .sort((a, b) => (b.SoLuongNguoiMua || 0) - (a.SoLuongNguoiMua || 0))
            .slice(0, 6);
          console.log(this.evaluateDish);
        },
        error: (error) => {
          console.log(error);
        },
      });
      return;
    }
    this.dishService.getAllDishByUser(this.user.data[0].MaKhachHang).subscribe({
      next: (dishes) => {
        const data: Dish[] = dishes;
        this.evaluateDish = data
          .sort((a, b) => (b.SoLuongNguoiMua || 0) - (a.SoLuongNguoiMua || 0))
          .slice(0, 6);
        console.log(this.evaluateDish);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  goToPage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.getAllDishLasted(pageNumber);
      this.router.navigate([], {
        queryParams: { page: pageNumber },
        queryParamsHandling: 'merge',
      });
    }
  }
}
