import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private router: Router) {}
  goToFooter(index: number): void {
    if (index == 1) {
      this.router.navigateByUrl('/introduction');
    } else if (index == 2) {
      this.router.navigateByUrl('/contact');
    }
  }
}
