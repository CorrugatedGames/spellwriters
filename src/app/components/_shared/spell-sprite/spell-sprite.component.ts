import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sw-spell-sprite',
  template: `
    <div class="image-container">
      <img
        [src]="imgUrl"
        [style.object-position]="spriteLocation"
        alt="spell sprite"
      />
    </div>
  `,
  styles: `
  :host {
  width: var(--sprite-size);
  height: var(--sprite-size);
  display: inline-block;

  .image-container {
    width: var(--sprite-size);
    height: var(--sprite-size);

    img {
      width: var(--sprite-size);
      height: var(--sprite-size);

      object-fit: none;
    }
  }
}
`,
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
