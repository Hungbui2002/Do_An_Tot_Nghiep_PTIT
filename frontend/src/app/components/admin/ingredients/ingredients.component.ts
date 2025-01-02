import { MessageService } from 'primeng/api';
import { Ingredient } from './../../../share/models/Ingredient';
import { IngredientService } from './../../../services/ingredient.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css'],
})
export class IngredientsComponent implements OnInit {
  constructor(
    private ingredientService: IngredientService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ingredients: Ingredient[] = [];
  ngOnInit(): void {
    this.getAllIngredient();
  }

  getAllIngredient(): void {
    this.ingredientService.getAllIngredient().subscribe({
      next: (ingredients) => (this.ingredients = ingredients),
      error: (error) => console.error(error),
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(IngredientsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ingredientService.createIngredient(result).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Thêm nguyên liệu thành công!',
          });
          this.getAllIngredient();
        });
      }
    });
  }

  openEditDialog(ingredientId: string, ingredient: any): void {
    const dialogRef = this.dialog.open(IngredientsDialogComponent, {
      data: ingredient,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ingredientService
          .updateIngredient(ingredientId, result)
          .subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Cập nhật nguyên liệu thành công!',
            });
            this.getAllIngredient();
          });
      }
    });
  }

  deleteIngredient(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      this.ingredientService.deleteIngredient(id).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Xóa nguyên liệu thành công!',
        });
        this.getAllIngredient();
      });
    }
  }
}
