import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared.module';
import { DebugComponentsRoutingModule } from './components-routing.module';
import { DebugComponentsComponent } from './components.component';

@NgModule({
  declarations: [DebugComponentsComponent],
  imports: [CommonModule, SharedModule, DebugComponentsRoutingModule],
})
export class DebugComponentsModule {}
