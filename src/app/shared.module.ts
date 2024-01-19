import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { CharacterSpriteComponent } from './components/_shared/character-sprite/character-sprite.component';
import { IconElementComponent } from './components/_shared/icon-element/icon-element.component';
import { IconStatComponent } from './components/_shared/icon-stat/icon-stat.component';
import { IconComponent } from './components/_shared/icon/icon.component';
import { SpellCardComponent } from './components/_shared/spell-card/spell-card.component';
import { SpellSpriteComponent } from './components/_shared/spell-sprite/spell-sprite.component';
import { DeckComponent } from './components/play/deck/deck.component';
import { HandComponent } from './components/play/hand/hand.component';
import { HealthBarComponent } from './components/play/health-bar/health-bar.component';
import { ManaBarComponent } from './components/play/mana-bar/mana-bar.component';
import { NextTurnComponent } from './components/play/nextturn/nextturn.component';

const components = [
  CharacterSpriteComponent,
  SpellSpriteComponent,
  SpellCardComponent,
  IconElementComponent,
  IconStatComponent,
  IconComponent,
  ManaBarComponent,
  HealthBarComponent,
  DeckComponent,
  HandComponent,
  NextTurnComponent,
];

@NgModule({
  declarations: components,
  exports: [...components, AngularSvgIconModule, NgbTooltipModule],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    NgbProgressbarModule,
    NgbTooltipModule,
  ],
})
export class SharedModule {}
