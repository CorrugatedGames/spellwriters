import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { NewRunComponent } from './new-run.component';

const routes: Routes = [
  {
    path: '',
    component: NewRunComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewRunRoutingModule {}
