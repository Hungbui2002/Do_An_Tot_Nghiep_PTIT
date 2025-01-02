import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../share/models/Category';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesListComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}
  categories: Category[] = [];
  @Input() typeDisplay: string = 'grid';
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => {
        if (error.status === 500) console.error('Internal Error');
      },
    });
  }
  changeCategory(categoryId: string): void {
    this.router.navigateByUrl('/category/' + categoryId);
  }
}
