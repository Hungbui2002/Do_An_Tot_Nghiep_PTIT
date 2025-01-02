import { UserService } from './../../../services/user.service';
import { User } from './../../../share/models/User';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  users: User[] = [];
  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users = users;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Xóa thành công!',
          });
          this.getAllUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Xóa thất bại!',
          });
        },
      });
    }
  }
}
