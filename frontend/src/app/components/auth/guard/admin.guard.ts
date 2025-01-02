import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUserFromLocalStorage();

  if (user && user.token) {
    if (user.data[0].VaiTro === 'Admin') {
      return true;
    } else {
      router.navigate(['not-found']);
      return false;
    }
  }

  router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
