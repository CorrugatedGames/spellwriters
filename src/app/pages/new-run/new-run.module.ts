import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { NewRunRoutingModule } from './new-run-routing.module';
import { NewRunComponent } from './new-run.component';

@NgModule({
  declarations: [NewRunComponent],
  imports: [CommonModule, SharedModule, NewRunRoutingModule],
})
export class NewRunModule {}
