import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UploadService } from 'src/app/services/upload.service';
import { IngredientService } from 'src/app/services/ingredient.service';
import { DishService } from 'src/app/services/dish.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/share/models/Category';
import { Ingredient } from 'src/app/share/models/Ingredient';

@Component({
  selector: 'app-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css'],
})
export class EditDishComponent implements OnInit {
  dishForm!: FormGroup;
  categories: Category[] = [];
  ingredients: Ingredient[] = [];
  popularity = ['5', '4', '3', '2', '1'];
  level = ['Dễ', 'Trung bình', 'Khó'];
  fileUpload?: File;
  preview: string = '';
  dishId!: string; // ID món ăn lấy từ URL

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
    private uploadService: UploadService,
    private dishService: DishService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Lấy ID từ tham số URL
    this.dishId = this.route.snapshot.paramMap.get('dishId') || '';

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
    this.getDishDetails();
    this.getIngredientById();
  }

  // Lấy danh sách danh mục và nguyên liệu
  getData(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
    });
    this.ingredientService.getAllIngredient().subscribe({
      next: (ingredients) => (this.ingredients = ingredients),
    });
  }

  // Lấy chi tiết món ăn theo ID
  getDishDetails(): void {
    this.dishService.getDishByIdAndUser(this.dishId).subscribe({
      next: (dish) => {
        this.dishForm.patchValue(dish); // Đổ dữ liệu vào form
        this.preview = dish.Anh;

        // Đổ dữ liệu các bước làm
        dish.CacBuocLam.forEach((step: any) =>
          this.cacBuocLam.push(
            this.fb.group({
              Buoc: [step.Buoc, Validators.required],
              MoTaBuoc: [step.MoTaBuoc, Validators.required],
              AnhBuoc: this.fb.array(step.AnhBuoc || []),
            })
          )
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to fetch dish details:', error);
      },
    });
  }
  // Lấy nguyên liệu theo mã
  getIngredientById(): void {
    this.dishService.getIngredientById(this.dishId).subscribe((ingredient) => {
      ingredient.forEach((ingredient: any) =>
        this.nguyenLieu.push(
          this.fb.group({
            MaNguyenLieu: [ingredient.MaNguyenLieu, Validators.required],
            KhoiLuong: [ingredient.KhoiLuong, Validators.required],
          })
        )
      );
    });
  }

  // Getters for FormArray
  get nguyenLieu(): FormArray {
    return this.dishForm.get('NguyenLieu') as FormArray;
  }

  get cacBuocLam(): FormArray {
    return this.dishForm.get('CacBuocLam') as FormArray;
  }

  // Các hàm xử lý logic thêm, xóa nguyên liệu và bước làm
  addIngredient() {
    this.nguyenLieu.push(
      this.fb.group({
        MaNguyenLieu: ['', Validators.required],
        KhoiLuong: [0, Validators.required],
      })
    );
    this.cdr.detectChanges();
  }

  removeIngredient(index: number) {
    this.nguyenLieu.removeAt(index);
  }

  addStep(): void {
    this.cacBuocLam.push(
      this.fb.group({
        Buoc: ['', Validators.required],
        MoTaBuoc: ['', Validators.required],
        AnhBuoc: this.fb.array([]),
      })
    );
    this.cdr.detectChanges();
  }

  removeStep(index: number): void {
    this.cacBuocLam.removeAt(index);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      this.preview = previewUrl;

      this.uploadService.uploadImage(file, 'dishes').subscribe({
        next: (downloadURL) => {
          this.preview = downloadURL;
        },
      });
    }
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

  submit(): void {
    const dishData = this.dishForm.value;

    const updatedDish = {
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

    this.dishService.updateDish(this.dishId, updatedDish).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/dish');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cập nhật món ăn thành công!',
        });
      },
      error: (error) => {
        console.error('Failed to update dish:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cập nhật món ăn thất bại!',
        });
      },
    });
  }
}
