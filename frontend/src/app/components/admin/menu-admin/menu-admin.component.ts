import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css'],
})
export class MenuAdminComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  changeTabIndex(tabIndex: number): void {
    if (tabIndex == 1) {
      this.router.navigateByUrl('/admin/dish');
    } else if (tabIndex == 2) {
      this.router.navigateByUrl('/admin/category');
    } else if (tabIndex == 3) {
      this.router.navigateByUrl('/admin/ingredient');
    } else if (tabIndex == 4) {
      this.router.navigateByUrl('/admin/user');
    } else if (tabIndex == 5) {
      this.router.navigateByUrl('/admin/payment');
    }
  }
}
