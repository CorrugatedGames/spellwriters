import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sw-spell-sprite',
  templateUrl: './spell-sprite.component.html',
  styleUrl: './spell-sprite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellSpriteComponent {
  public mod = input<string>('default');
  public asset = input<string>('spells.webp');
  public sprite = input.required<number>();

  public get imgUrl(): string {
    return `assets/mods/${this.mod()}/${this.asset()}`;
  }

  public get spriteLocation() {
    const spritesPerRow = 20;
    const spriteSize = 64;

    const sprite = this.sprite();
    const y = Math.floor(sprite / spritesPerRow);
    const x = sprite % spritesPerRow;
    return `-${x * spriteSize}px -${y * spriteSize}px`;
  }
}
