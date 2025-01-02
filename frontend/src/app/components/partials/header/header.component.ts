import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  user: any;

  ngOnInit(): void {
    this.getUser();
  }

  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
  goToRegister(): void {
    this.router.navigateByUrl('/auth/register');
  }
  goToTab(tab: number): void {
    if (tab == 1) {
      this.router.navigateByUrl('/admin/dish');
    } else if (tab == 2) {
      this.router.navigateByUrl('/payment-history');
    }
  }
  changeTabMenu(tab: number) {
    if (tab == 1) {
      this.router.navigateByUrl('/dish-paid');
    } else if (tab == 3) {
      this.router.navigateByUrl('/introduction');
    }
  }
  getUser(): void {
    this.user = this.authService.getUserFromLocalStorage();
  }
  logout(): void {
    this.authService.logout();
  }
}
