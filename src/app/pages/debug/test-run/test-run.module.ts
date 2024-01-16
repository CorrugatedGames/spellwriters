import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared.module';
import { TestRunRoutingModule } from './test-run-routing.module';
import { DebugTestRunComponent } from './test-run.component';

@NgModule({
  declarations: [DebugTestRunComponent],
  imports: [CommonModule, SharedModule, TestRunRoutingModule],
})
export class DebugTestRunModule {}
