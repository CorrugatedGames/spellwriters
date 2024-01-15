import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-spell-sprite',
  templateUrl: './spell-sprite.component.html',
  styleUrl: './spell-sprite.component.scss',
})
export class SpellSpriteComponent {
  @Input() mod = 'default';
  @Input() asset = 'spells.webp';
  @Input({ required: true }) public sprite!: number;

  public get imgUrl(): string {
    return `assets/mods/${this.mod}/${this.asset}`;
  }

  public get spriteLocation() {
    const spritesPerRow = 20;
    const spriteSize = 64;

    const sprite = this.sprite;
    const y = Math.floor(sprite / spritesPerRow);
    const x = sprite % spritesPerRow;
    return `-${x * spriteSize}px -${y * spriteSize}px`;
  }
}
