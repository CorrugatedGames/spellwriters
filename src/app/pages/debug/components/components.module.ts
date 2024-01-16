import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared.module';
import { DebugComponentsRoutingModule } from './components-routing.module';
import { DebugComponentsComponent } from './components.component';

@NgModule({
  declarations: [DebugComponentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbTooltipModule,
    DebugComponentsRoutingModule,
  ],
})
export class DebugComponentsModule {}
