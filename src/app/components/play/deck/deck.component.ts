import {
  Component,
  EventEmitter,
  HostBinding,
  Output,
  input,
} from '@angular/core';
import { getSpellById } from '../../../helpers';
import { PlayableCard } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-deck',
  template: `
    <div
      class="deck-card-container"
      (click)="drawCard.next()"
      (keyup.enter)="drawCard.next()"
      tabindex="0"
    >
      <div
        class="deck-card"
        *ngFor="let deckSize of [0, 1, 2]"
        [style.--card-index]="deckSize"
      >
        <sw-spell-card
          *ngIf="deck().length > deckSize"
          [spell]="getSpellById('')!"
          [isUpsideDown]="true"
          [isSmall]="true"
        ></sw-spell-card>
      </div>
    </div>
  `,
  styles: `
    :host {
      &.glowing {
        animation: glow 1s infinite alternate;

        .deck-card-container {
          cursor: pointer;
        }
      }
      
      display: block;
      position: relative;
      height: calc(
        calc(24px * clamp(0, calc(var(--cards-in-deck) - 1), 2)) +
          var(--spell-card-height-small)
      );
      width: var(--spell-card-width-small);
    }

    .deck-card-container {
      cursor: not-allowed;

      .deck-card {
        pointer-events: none;
        position: absolute;
        z-index: calc(10 + var(--card-index));
        left: -70px;
        bottom: calc((var(--card-index) * 24px) + 100px);

        height: var(--spell-card-height-small);
        width: var(--spell-card-width-small);
      }
    }
  `,
})
export class DeckComponent {
  getSpellById = getSpellById;

  public deck = input.required<PlayableCard[]>();
  public isGlowing = input<boolean>(false);

  @Output() public drawCard = new EventEmitter<void>();

  @HostBinding('class.glowing')
  public get shouldGlow(): boolean {
    return this.deck().length === 0 ? false : this.isGlowing();
  }

  @HostBinding('style.--cards-in-deck')
  public get cardsInDeck(): number {
    return this.deck().length;
  }

  constructor(public contentService: ContentService) {}
}
