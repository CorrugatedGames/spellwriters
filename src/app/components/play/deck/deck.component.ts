import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
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
          *ngIf="deck.length > deckSize"
          [spell]="contentService.getSpell('')!"
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
      }
    }

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

  @HostBinding('class.glowing')
  @Input()
  public glowing = false;

  @Output() public drawCard = new EventEmitter<void>();

  constructor(public contentService: ContentService) {}
}
