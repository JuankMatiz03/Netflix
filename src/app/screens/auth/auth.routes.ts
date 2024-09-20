import { Routes } from "@angular/router";
import { ROUTES_ROOT } from '@constants/routes.constant';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: ROUTES_ROOT.LOGIN,
    pathMatch: 'full'
  },
  {
    path: ROUTES_ROOT.LOGIN,
    loadComponent: () => import('@screens/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: ROUTES_ROOT.REGISTER,
    loadComponent: () => import('@screens/auth/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: ROUTES_ROOT.PASSWORD_RECOVERY,
    loadComponent: () => import('@screens/auth/password-recovery/password-recovery.page').then(m => m.PasswordRecoveryPage),
  },
  {
    path: '**',
    redirectTo: ROUTES_ROOT.LOGIN,
    pathMatch: 'full'
  },
];
