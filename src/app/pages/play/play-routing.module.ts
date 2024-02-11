import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { PlayComponent } from './play.component';

const routes: Routes = [
  {
    path: '',
    component: PlayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayRoutingModule {}
