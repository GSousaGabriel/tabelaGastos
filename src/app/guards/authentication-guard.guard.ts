import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { inject } from '@angular/core';

export const authenticationGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const hasToken = authService.getAuthToken();

  if (!authService.getAuthToken()) {
    const loginPath = router.parseUrl('/user/login');
    return new RedirectCommand(loginPath, {
      skipLocationChange: true
    });
  }
  return true;
};
