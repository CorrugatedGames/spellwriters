import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'new-run',
    loadChildren: () =>
      import('./pages/new-run/new-run.module').then((m) => m.NewRunModule),
  },
  {
    path: 'play',
    loadChildren: () =>
      import('./pages/play/play.module').then((m) => m.PlayModule),
  },
  {
    path: 'debug/test-run',
    loadChildren: () =>
      import('./pages/debug/test-run/test-run.module').then(
        (m) => m.DebugTestRunModule,
      ),
  },
  {
    path: 'debug/components',
    loadChildren: () =>
      import('./pages/debug/components/components.module').then(
        (m) => m.DebugComponentsModule,
      ),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
