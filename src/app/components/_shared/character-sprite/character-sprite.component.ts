import { Component, HostBinding, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

const numFrames = 4;

@Component({
  selector: 'sw-character-sprite',
  templateUrl: './character-sprite.component.html',
  styleUrl: './character-sprite.component.scss',
})
export class CharacterSpriteComponent {
  private baseSprite = 0;
  private currentSprite = 0;

  public get sprite() {
    return this.baseSprite;
  }

  @Input() mod = 'default';
  @Input() asset = 'characters.webp';

  @Input({ required: true })
  public set sprite(value: number) {
    this.baseSprite = value * numFrames;
    this.currentSprite = value * numFrames;
  }

  public get imgUrl(): string {
    return `assets/mods/${this.mod}/${this.asset}`;
  }

  @HostBinding('style.--animation-position')
  public get spriteLocation() {
    const spritesPerRow = 20;
    const spriteSize = 64;

    const sprite = this.currentSprite;
    const y = Math.floor(sprite / spritesPerRow);
    const x = sprite % spritesPerRow;
    return `-${x * spriteSize}px -${y * spriteSize}px`;
  }

  constructor() {
    interval(100)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.currentSprite++;
        if (this.currentSprite >= this.baseSprite + numFrames) {
          this.currentSprite = this.baseSprite;
        }
      });
  }
}
