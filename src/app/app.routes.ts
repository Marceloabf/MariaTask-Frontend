import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
    { path: 'tasks', loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASKS_ROUTES) },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
  ];
