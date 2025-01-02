import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;
  previewImage: string | null = null; // URL để xem trước ảnh

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Dữ liệu danh mục (nếu sửa)
  ) {
    this.categoryForm = this.fb.group({
      LoaiMon: [data?.LoaiMon || '', Validators.required],
      MoTa: [data?.MoTa || ''],
      Anh: [data?.Anh || ''], // URL ảnh
    });

    this.previewImage = data?.Anh || null; // Hiển thị ảnh hiện tại (nếu có)
  }

  onCancel(): void {
    this.dialogRef.close(); // Đóng dialog
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value); // Trả dữ liệu về component cha
    }
  }

  // Xử lý upload ảnh
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Gọi service để upload ảnh
      this.uploadService.uploadImage(file, 'categories').subscribe({
        next: (url) => {
          this.previewImage = url; // Hiển thị ảnh sau khi upload
          this.categoryForm.patchValue({ Anh: url }); // Gán URL vào form
        },
        error: (error) => {
          console.error('Upload failed', error);
        },
      });
    }
  }
}
