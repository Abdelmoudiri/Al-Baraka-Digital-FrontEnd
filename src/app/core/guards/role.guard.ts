import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Récupérer les rôles autorisés depuis la route
    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    const userRole = authService.getUserRole();

    if (userRole && allowedRoles.includes(userRole)) {
        return true;
    }

    // Rediriger vers une page non autorisée ou login
    router.navigate(['/auth/login']);
    return false;
};
