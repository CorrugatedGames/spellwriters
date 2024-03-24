import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from './play.component';
import { CombatComponent } from './combat/combat.component';

@NgModule({
  declarations: [PlayComponent, CombatComponent],
  imports: [CommonModule, SharedModule, PlayRoutingModule],
})
export class PlayModule {}
