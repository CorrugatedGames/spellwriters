import { Component, Input } from '@angular/core';
import { PlayableCard } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-deck',
  template: `
    <div class="deck-card-container">
      <div
        class="deck-card"
        *ngFor="let deckSize of [0, 1, 2]"
        [style.--card-index]="deckSize"
      >
        <sw-spell-card
          *ngIf="deck.length > deckSize"
          [spell]="contentService.getSpell('')!"
          [isUpsideDown]="true"
          [isSmall]="true"
        ></sw-spell-card>
      </div>
    </div>
  `,
  styles: `
    .deck-card-container {
      cursor: pointer;

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
  @Input({ required: true }) public deck: PlayableCard[] = [];

  constructor(public contentService: ContentService) {}
}
