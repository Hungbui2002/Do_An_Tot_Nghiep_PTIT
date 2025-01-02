import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUserFromLocalStorage();

  if (user && user.token) {
    return true;
  }

  router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
