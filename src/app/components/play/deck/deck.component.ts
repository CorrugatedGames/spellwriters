import {
  Component,
  EventEmitter,
  HostBinding,
  Output,
  input,
  type OnChanges,
} from '@angular/core';
import { getSpellById } from '../../../helpers';
import { type PlayableCard } from '../../../interfaces';

@Component({
  selector: 'sw-deck',
  template: `
    <div
      class="deck-card-container"
      [class.glowing]="shouldGlow"
      (click)="drawCard.next()"
      (keyup.enter)="drawCard.next()"
      tabindex="0"
    >
      @for (deckSize of [0, 1, 2]; track $index) {
        <div class="deck-card" [style.--card-index]="deckSize">
          @if (deck().length > deckSize) {
            <sw-spell-card
              [spell]="getSpellById('')!"
              [isUpsideDown]="true"
              [isSmall]="true"
            ></sw-spell-card>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnChanges {
  getSpellById = getSpellById;

  public deck = input.required<PlayableCard[]>();
  public isGlowing = input<boolean>(false);

  public shouldGlow = false;

  @Output() public drawCard = new EventEmitter<void>();

  ngOnChanges() {
    this.shouldGlow = this.deck().length === 0 ? false : this.isGlowing();
  }

  @HostBinding('style.--cards-in-deck')
  public get cardsInDeck(): number {
    return this.deck().length;
  }
}
