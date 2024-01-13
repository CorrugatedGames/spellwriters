import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CharacterSpriteComponent } from './components/_shared/character-sprite/character-sprite.component';
import { SpellCardComponent } from './components/_shared/spell-card/spell-card.component';
import { SpellSpriteComponent } from './components/_shared/spell-sprite/spell-sprite.component';

const components = [
  CharacterSpriteComponent,
  SpellSpriteComponent,
  SpellCardComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule {}
