import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { CharacterSpriteComponent } from './components/_shared/character-sprite/character-sprite.component';
import { IconElementComponent } from './components/_shared/icon-element/icon-element.component';
import { IconStatComponent } from './components/_shared/icon-stat/icon-stat.component';
import { IconComponent } from './components/_shared/icon/icon.component';
import { SpellCardComponent } from './components/_shared/spell-card/spell-card.component';
import { SpellSpriteComponent } from './components/_shared/spell-sprite/spell-sprite.component';

const components = [
  CharacterSpriteComponent,
  SpellSpriteComponent,
  SpellCardComponent,
  IconElementComponent,
  IconStatComponent,
  IconComponent,
];

@NgModule({
  declarations: components,
  exports: [...components, AngularSvgIconModule, NgbTooltipModule],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    NgbTooltipModule,
  ],
})
export class SharedModule {}
