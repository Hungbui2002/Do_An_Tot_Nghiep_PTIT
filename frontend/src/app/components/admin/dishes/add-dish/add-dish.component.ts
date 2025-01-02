import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { DishService } from 'src/app/services/dish.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/share/models/Category';
import { Ingredient } from 'src/app/share/models/Ingredient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css'],
})
export class AddDishComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private ingredientService: IngredientService,
    private uploadService: UploadService, // Thêm service upload ảnh
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.dishForm = this.fb.group({
      TenMon: ['', Validators.required],
      MoTa: [''],
      MaLoaiMon: ['', Validators.required],
      DoPhoBien: ['', Validators.required],
      ThoiGianNau: [null, Validators.required],
      DoKho: ['', Validators.required],
      Gia: [null, Validators.required],
      Calo: [null, Validators.required],
      Anh: [''],
      NguyenLieu: this.fb.array([]),
      CacBuocLam: this.fb.array([]),
    });
    this.getData();
  }

  dishForm!: FormGroup;
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  popularity = ['5', '4', '3', '2', '1'];
  level = ['Dễ', 'Trung bình', 'Khó'];
  fileUpload?: File;
  preview: string = '';

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => {
        if (error.status === 500) console.error('Internal Error');
      },
    });
  }

  getAllIngredient(): void {
    this.ingredientService.getAllIngredient().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      this.preview = previewUrl;
      this.uploadImage(file); // Upload ảnh khi người dùng chọn
    }
  }

  uploadImage(file: File): void {
    const folderPath = 'dishes'; // Đường dẫn thư mục trên Firebase Storage
    this.uploadService.uploadImage(file, folderPath).subscribe({
      next: (downloadURL) => {
        this.preview = downloadURL;
        console.log(this.preview); // Lưu URL của ảnh sau khi upload thành công
      },
      error: (error) => {
        console.error('Failed to upload image:', error);
      },
    });
  }

  getData(): void {
    this.getAllCategories();
    this.getAllIngredient();
  }

  // Hàm để thêm các bước làm
  get nguyenLieu(): FormArray {
    return this.dishForm.get('NguyenLieu') as FormArray;
  }

  get cacBuocLam(): FormArray {
    return this.dishForm.get('CacBuocLam') as FormArray;
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      MaNguyenLieu: ['', Validators.required],
      KhoiLuong: [0, Validators.required],
    });
    this.nguyenLieu.push(ingredientGroup);

    this.cdr.detectChanges();
  }

  removeIngredient(index: number) {
    this.nguyenLieu.removeAt(index);
  }

  addStep(): void {
    const stepForm = this.fb.group({
      Buoc: ['', Validators.required],
      MoTaBuoc: ['', Validators.required],
      AnhBuoc: this.fb.array([]), // Mảng chứa URL của các ảnh
    });
    this.cacBuocLam.push(stepForm);
    this.cdr.detectChanges();
  }

  removeStep(index: number): void {
    this.cacBuocLam.removeAt(index);
  }

  onStepFileSelected(event: any, index: number): void {
    const files: FileList = event.target.files;
    const anhBuocArray = this.cacBuocLam.at(index).get('AnhBuoc') as FormArray;

    anhBuocArray.clear(); // Xóa các ảnh đã có trong mảng AnhBuoc

    // Duyệt qua tất cả các tệp được chọn
    Array.from(files).forEach((file: File) => {
      // Gọi phương thức uploadImage của UploadService để upload ảnh lên Firebase
      const folderPath = 'steps'; // Đường dẫn thư mục trên Firebase
      this.uploadService.uploadImage(file, folderPath).subscribe({
        next: (downloadURL) => {
          // Lưu URL của ảnh vào mảng AnhBuoc
          anhBuocArray.push(this.fb.control(downloadURL));
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
        },
      });
    });
  }

  getAnhBuocArray(index: number): FormArray {
    return this.cacBuocLam.at(index).get('AnhBuoc') as FormArray;
  }

  submit() {
    const dishData = this.dishForm.value;

    const dataToSend = {
      TenMon: dishData.TenMon,
      Calo: dishData.Calo,
      DoPhoBien: dishData.DoPhoBien,
      Gia: dishData.Gia,
      MoTa: dishData.MoTa,
      Anh: this.preview, // Đưa URL ảnh vào data
      CacBuocLam: dishData.CacBuocLam,
      ThoiGianNau: dishData.ThoiGianNau,
      DoKho: dishData.DoKho,
      MaLoaiMon: dishData.MaLoaiMon,
      NguyenLieus: dishData.NguyenLieu,
    };
    console.log(dataToSend);
    this.dishService.createDish(dataToSend).subscribe({
      next: () => {
        console.log('Dish created successfully');
        this.router.navigateByUrl('/admin/dish');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Thêm món ăn thành công!',
        });
      },
      error: (error) => {
        console.error('Failed to create dish:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Thêm món ăn thất bại!',
        });
      },
    });
  }
}
