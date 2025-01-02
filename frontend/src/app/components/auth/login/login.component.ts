import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuider: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  isHiddenPassword: boolean = true;
  returnUrl: string = '';
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuider.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    console.log(this.returnUrl);
  }

  login(): void {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.setUserToLocalStorage(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Đăng nhập thành công',
        });
        if (response.data[0].VaiTro == 'Admin') {
          this.router.navigateByUrl('/admin/dish');
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (error) => {
        console.error(error);
        if (error.status == 400 || error.status == 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email hoặc mật khẩu không đúng!',
          });
        } else if (error.status === 500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Lỗi máy chủ!',
          });
        }
      },
    });
  }

  toggleHiddenPassword(): void {
    this.isHiddenPassword = !this.isHiddenPassword;
  }
}
