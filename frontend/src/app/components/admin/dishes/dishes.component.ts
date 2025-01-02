import { DishService } from './../../../services/dish.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dish } from 'src/app/share/models/Dish';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  constructor(
    private dishService: DishService,
    private router: Router,
    private messageService: MessageService
  ) {}

  dishes: Dish[] = [];
  searchTerm: string = '';
  totalPages: number = 0;
  currentPage: number = 1;
  ngOnInit(): void {
    this.getAllDishLasted(this.currentPage);
  }

  getAllDishLasted(page: number): void {
    this.dishService.getAllDishByPage(page).subscribe({
      next: (response) => {
        this.dishes = response.data;
        this.totalPages = response.totalPages;
        this.currentPage = page;
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteDish(dishId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      this.dishService.deleteDishById(dishId).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Xóa món ăn thành công!',
        });
        this.getAllDishLasted(this.currentPage);
      });
    }
  }

  goToAddDish(): void {
    this.router.navigate(['admin/add-dish']);
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
  goToEditDish(dishId: string) {
    this.router.navigateByUrl('admin/edit-dish/' + dishId);
  }
}
