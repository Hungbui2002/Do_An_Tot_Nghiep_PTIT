import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ingredient-dialog',
  templateUrl: './ingredients-dialog.component.html',
  styleUrls: ['./ingredients-dialog.component.css'],
})
export class IngredientsDialogComponent {
  ingredientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IngredientsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Dữ liệu truyền từ dialog mở
  ) {
    this.ingredientForm = this.fb.group({
      TenNguyenLieu: [data?.TenNguyenLieu || '', Validators.required],
      GiaDonVi: [data?.GiaDonVi || ''],
      DonVi: [data?.DonVi || '', Validators.required],
      MoTa: [data?.MoTa || ''],
      DieuKienBaoQuan: [data?.DieuKienBaoQuan || ''],
    });
  }

  onCancel(): void {
    this.dialogRef.close(); // Đóng dialog mà không làm gì
  }

  onSave(): void {
    if (this.ingredientForm.valid) {
      this.dialogRef.close(this.ingredientForm.value); // Trả dữ liệu về component cha
    }
  }
}
