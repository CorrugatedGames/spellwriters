import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { getModAssetInformationByName } from '../../../helpers';
import { spriteIterationCount } from '../../../helpers/static/sprite';
import { Spritable } from '../../../interfaces';

@Component({
  selector: 'sw-sprite',
  template: `
    <div
      class="image-container"
      [style.--animation-position]="currentAnimationPosition()"
    >
      <img [src]="imgUrl" alt="sprite" />
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
export class SpriteComponent {
  public spritable = input.required<Spritable>();

  private mod = computed(() => this.spritable().mod);
  private asset = computed(() => this.spritable().asset);
  private sprite = computed(() => this.spritable().sprite);

  public assetInformation = computed(() =>
    getModAssetInformationByName(this.mod(), this.asset()),
  );
  private numFrames = computed(
    () => this.assetInformation()?.framesPerAnimation ?? 1,
  );
  private currentSprite = computed(
    () => this.sprite() * this.numFrames() + this.currentFrame(),
  );
  private currentFrame = computed(
    () => spriteIterationCount() % this.numFrames(),
  );

  public currentAnimationPosition = computed(() => {
    const assetInformation = this.assetInformation();
    const spritesPerRow = assetInformation?.spritesPerRow ?? 10;
    const spriteSize = assetInformation?.spriteSize ?? 64;

    const sprite = this.currentSprite();
    const y = Math.floor(sprite / spritesPerRow);
    const x = sprite % spritesPerRow;
    return `-${x * spriteSize}px -${y * spriteSize}px`;
  });

  public get imgUrl(): string {
    return `assets/mods/${this.mod()}/${this.asset()}`;
  }
}
