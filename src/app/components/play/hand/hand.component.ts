import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayableCard, SelectedCard } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-hand',
  template: `
    <div class="hand-card-container">
      <div
        class="hand-card-position"
        *ngFor="let card of hand; let index = index"
        [style.--card-index]="index"
        (mouseenter)="focusHandCard(index)"
        (mouseleave)="unfocusHandCard()"
        (contextmenu)="unselectCardFromHand(index); $event.preventDefault()"
        (click)="selectCard.emit({ card, index })"
        (keyup.enter)="selectCard.emit({ card, index })"
        [tabindex]="index"
      >
        <sw-spell-card
          class="hand-card"
          [class.selected]="selectedCard?.index === index"
          [spell]="contentService.getSpell(card.id)!"
          [isSmall]="hoveringSpellIndex !== index"
          [isGlowing]="selectedCard?.index === index"
        ></sw-spell-card>
      </div>
    </div>
  `,
  styles: `
    .hand-card-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-content: flex-start;

      height: 100%;
      position: relative;
      max-width: 600px;
      left: 64px;

      .hand-card-position {
        display: flex;
        flex-direction: row;
        flex: 1 1 100%;
        min-width: 0;

        width: var(--spell-card-width-small);
        height: var(--spell-card-height-small);
        position: relative;

        cursor: pointer;

        &:hover {
          z-index: 1000;
        }

        .hand-card {
          position: absolute;
          bottom: -60px;
          left: -68px;

          z-index: calc(10 + var(--card-index));

          &.selected {
            z-index: 100;
          }
        }
      }
    }
  `,
})
export class HandComponent {
  @Input({ required: true }) public hand: PlayableCard[] = [];
  @Input() public selectedCard?: SelectedCard;
  @Output() public selectCard = new EventEmitter<SelectedCard>();
  @Output() public unselectCard = new EventEmitter<SelectedCard>();

  public hoveringSpellIndex = -1;

  constructor(public contentService: ContentService) {}

  public focusHandCard(index: number) {
    this.hoveringSpellIndex = index;
  }

  public unfocusHandCard() {
    this.hoveringSpellIndex = -1;
  }

  public unselectCardFromHand(index: number) {
    if (this.selectedCard?.index !== index) return;
    this.unselectCard.emit();
  }
}
