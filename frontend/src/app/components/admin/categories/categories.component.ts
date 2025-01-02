import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/share/models/Category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}
  categories: any[] = [];
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        if (error.status === 500) console.error('Internal Error');
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.createCategory(result).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Thêm danh mục thành công!',
          });
          this.getAllCategories();
        });
      }
    });
  }

  openEditDialog(categoryId: string, category: any): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.categoryService
          .updateCategory(categoryId, result)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sửa món ăn thành công!',
            });
            this.getAllCategories();
          });
      }
    });
  }

  deleteCategory(maLoaiMon: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(maLoaiMon).subscribe((result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Xóa danh mục thành công!',
        });
        this.getAllCategories();
      });
    }
  }
}
