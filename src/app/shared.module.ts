import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  NgbModalModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ElementCardComponent } from './components/_shared/element-card/element-card.component';
import { FitTextComponent } from './components/_shared/fit-text/fit-text.component';
import { IconStatComponent } from './components/_shared/icon-stat/icon-stat.component';
import { IconComponent } from './components/_shared/icon/icon.component';
import { RelicCardComponent } from './components/_shared/relic-card/relic-card.component';
import { RelicIndicatorComponent } from './components/_shared/relic-indicator/relic-indicator.component';
import { SpellCardComponent } from './components/_shared/spell-card/spell-card.component';
import { SpriteComponent } from './components/_shared/sprite/sprite.component';
import { DeckComponent } from './components/play/deck/deck.component';
import { ErrorBannerComponent } from './components/play/error-banner/error-banner.component';
import { FieldElementComponent } from './components/play/field-element/field-element.component';
import { FieldSpellComponent } from './components/play/field-spell/field-spell.component';
import { HandComponent } from './components/play/hand/hand.component';
import { HealthBarComponent } from './components/play/health-bar/health-bar.component';
import { ManaBarComponent } from './components/play/mana-bar/mana-bar.component';
import { NextTurnComponent } from './components/play/nextturn/nextturn.component';
import { PauseGameComponent } from './components/play/pausegame/pausegame.component';
import { PhaseBannerComponent } from './components/play/phase-banner/phase-banner.component';
import { HoverClassDirective } from './directives/_shared/hover-class.directive';

const components = [
  HoverClassDirective,
  FitTextComponent,

  SpriteComponent,
  SpellCardComponent,
  ElementCardComponent,
  IconStatComponent,
  IconComponent,
  ManaBarComponent,
  HealthBarComponent,
  DeckComponent,
  HandComponent,
  NextTurnComponent,
  PauseGameComponent,
  PhaseBannerComponent,
  ErrorBannerComponent,
  FieldSpellComponent,
  FieldElementComponent,
  RelicCardComponent,
  RelicIndicatorComponent,
];

@NgModule({
  declarations: components,
  exports: [
    ...components,
    AngularSvgIconModule,
    NgbTooltipModule,
    NgbModalModule,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    NgbProgressbarModule,
    NgbTooltipModule,
  ],
})
export class SharedModule {}
