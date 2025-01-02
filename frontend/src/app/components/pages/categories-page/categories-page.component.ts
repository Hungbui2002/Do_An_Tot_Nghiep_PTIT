import { Category } from './../../../share/models/Category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/app/share/models/Dish';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css'],
})
export class CategoriesPageComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService,
    activatedRoute: ActivatedRoute
  ) {
    this.user = authService.getUserFromLocalStorage();
    activatedRoute.params.subscribe((params) => {
      const categoryId = params['categoryId'];
      this.getCategoryById(categoryId);
      activatedRoute.queryParams.subscribe((queryParams) => {
        const search = queryParams['search'];

        if (categoryId && search) {
          console.log(categoryId, search);
          this.getDishBySearch(search, categoryId);
        } else if (categoryId) {
          this.getAllDishByCategory(categoryId);
        }
      });
    });
  }
  dishes: Dish[] = [];
  category!: Category;
  user: any;

  ngOnInit(): void {}

  getAllDishByCategory(categoryId: string): void {
    this.dishes = [];
    if (!this.isLogin()) {
      this.categoryService.getAllDishByCategory(categoryId).subscribe({
        next: (dishes) => {
          this.dishes = dishes;
          console.log(this.dishes);
        },
        error: (error) => {
          console.log(error);
        },
      });
      return;
    }
    console.log(this.user.data[0].MaKhachHang);
    this.categoryService
      .getAllCategoryByUser(categoryId, this.user.data[0].MaKhachHang)
      .subscribe({
        next: (dishes) => {
          this.dishes = dishes;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getCategoryById(categoryId: string): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        this.category = category;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDishBySearch(dishName: string, categoryId: string): void {
    this.dishes = [];
    this.categoryService.getDishBySearch(dishName, categoryId).subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        console.log(this.dishes);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  isLogin(): boolean {
    if (!this.user || Object.keys(this.user).length === 0) {
      return false;
    }
    return true;
  }

  goToFoodPage(foodId: string): void {
    this.router.navigateByUrl('dish/' + foodId);
  }
}
