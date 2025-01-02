import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      hoTen: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      soDienThoai: ['', Validators.required],
      diaChi: ['', Validators.required],
      matKhau: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
    });
  }

  register(): void {
    if (this.passwordMatchValidator(this.registerForm)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Xác nhận mật khẩu không khớp!',
      });
      return;
    }

    const { hoTen, email, soDienThoai, diaChi, matKhau } =
      this.registerForm.value;
    const userData = {
      HoTen: hoTen,
      Email: email,
      SoDienThoai: soDienThoai,
      DiaChi: diaChi,
      MatKhau: matKhau,
    };
    console.log(userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/login']);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Đăng ký thành công',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Có lỗi xảy ra trong quá trình đăng ký',
        });
      },
    });
  }

  // Custom validator to check password and confirm password match
  passwordMatchValidator(
    formGroup: FormGroup
  ): null | { passwordMismatch: boolean } {
    const password = formGroup.get('matKhau')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
