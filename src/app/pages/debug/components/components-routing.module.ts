import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { DebugComponentsComponent } from './components.component';

const routes: Routes = [
  {
    path: '',
    component: DebugComponentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebugComponentsRoutingModule {}
