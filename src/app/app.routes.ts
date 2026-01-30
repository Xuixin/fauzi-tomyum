import { Routes } from '@angular/router';
import { OwnerPageContainerComponent } from './workspace/owner/layouts/owner-page-container/owner-page-container.component';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./shared/component/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },

  {
    path: 'owner',
    component: OwnerPageContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./workspace/owner/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'menu',
        loadComponent: () => import('./workspace/owner/pages/menu/menu.component').then((m) => m.MenuComponent),
      }
    ]
  }
];
