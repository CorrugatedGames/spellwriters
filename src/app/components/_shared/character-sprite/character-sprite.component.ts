import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { spriteIterationCount } from '../../../helpers/static/sprite';

const numFrames = 4;

@Component({
  selector: 'sw-character-sprite',
  template: `
    <div
      class="image-container"
      [style.--animation-position]="currentAnimationPosition()"
    >
      <img [src]="imgUrl" alt="character sprite" />
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
        object-position: var(--animation-position);
      }
    }
  }
  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterSpriteComponent {
  public mod = input<string>('default');
  public asset = input<string>('characters.webp');
  public sprite = input<number, number>(0, {
    transform: (v) => v * numFrames,
  });

  public currentSprite = computed(() => this.sprite() + this.currentFrame());

  public currentAnimationPosition = computed(() => {
    const spritesPerRow = 20;
    const spriteSize = 64;

    const sprite = this.currentSprite();
    const y = Math.floor(sprite / spritesPerRow);
    const x = sprite % spritesPerRow;
    return `-${x * spriteSize}px -${y * spriteSize}px`;
  });

  public currentFrame = computed(() => spriteIterationCount() % numFrames);

  public get imgUrl(): string {
    return `assets/mods/${this.mod()}/${this.asset()}`;
  }
}
