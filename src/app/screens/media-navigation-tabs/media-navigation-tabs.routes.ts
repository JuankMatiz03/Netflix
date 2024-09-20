import { Routes } from '@angular/router';
import { ROUTES_ROOT } from '@constants/routes.constant';
import { AuthGuard } from '@guards/auth.guard';

export const mediaNavigationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@screens/media-navigation-tabs/media-navigation-tabs.page').then(m => m.MediaNavigationTabsComponent),
    canActivateChild: [AuthGuard],
    children: [
      {
        path: ROUTES_ROOT.HOME,
        loadComponent: () => import('@screens/media-navigation-tabs/home/home.page').then((m) => m.HomePage),

      },
      {
        path: ROUTES_ROOT.FAVORITES,
        loadComponent: () => import('@screens/media-navigation-tabs/favorites/favorites.page').then((m) => m.FavoritesPage),
      },
      {
        path: ROUTES_ROOT.WATCH_LATER,
        loadComponent: () => import('@screens/media-navigation-tabs/watch-later/watch-later.page').then((m) => m.WatchLaterPage),
      },
      {
        path: ROUTES_ROOT.PROFILE,
        loadComponent: () =>import('@screens/media-navigation-tabs/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: `${ROUTES_ROOT.MOVIE_DETAIL}/:id`,
        loadComponent: () =>import('@screens/media-navigation-tabs/movie-detail/movie-detail.page').then((m) => m.MovieDetailPage),
      },
      {
        path: '',
        redirectTo: ROUTES_ROOT.HOME,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: ROUTES_ROOT.HOME,
    pathMatch: 'full',
  },
];
