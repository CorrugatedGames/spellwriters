import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { DebugTestRunComponent } from './test-run.component';

const routes: Routes = [
  {
    path: '',
    component: DebugTestRunComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRunRoutingModule {}
