import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared.module';
import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './play.component';

@NgModule({
  declarations: [PlayComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlayRoutingModule,
    NgbProgressbarModule,
  ],
})
export class PlayModule {}
