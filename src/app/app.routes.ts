import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth-module')
            .then(m => m.AuthModule)
    },

    {
        path: 'client',
        loadChildren: () => import('./features/client/client-module')
            .then(m => m.ClientModule),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['CLIENT'] }
    },
    {
        path: 'agent',
        loadChildren: () => import('./features/agent/agent-module')
            .then(m => m.AgentModule),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['AGENT_BANCAIRE'] }
    },

    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin-module')
            .then(m => m.AdminModule),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] }
    },

    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
