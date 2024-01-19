import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { DeckComponent } from '../../components/play/deck/deck.component';
import { HealthBarComponent } from '../../components/play/health-bar/health-bar.component';
import { ManaBarComponent } from '../../components/play/mana-bar/mana-bar.component';
import { SharedModule } from '../../shared.module';
import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './play.component';

@NgModule({
  declarations: [
    PlayComponent,
    ManaBarComponent,
    HealthBarComponent,
    DeckComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlayRoutingModule,
    NgbProgressbarModule,
  ],
})
export class PlayModule {}
