import { Routes } from '@angular/router';
import { ROUTES_ROOT } from '@constants/routes.constant';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`,
    pathMatch: 'full',
  },
  {
    path: ROUTES_ROOT.AUTH,
    loadChildren: () => import('@screens/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: ROUTES_ROOT.MEDIA_NAVIGATION,
    loadChildren: () => import('@screens/media-navigation-tabs/media-navigation-tabs.routes').then(m => m.mediaNavigationRoutes),
  },
  {
    path: '**',
    redirectTo: `${ROUTES_ROOT.AUTH}/${ROUTES_ROOT.LOGIN}`,
    pathMatch: 'full',
  },
];
