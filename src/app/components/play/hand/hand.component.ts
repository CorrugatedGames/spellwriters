import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayableCard } from '../../../interfaces';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'sw-hand',
  template: `
    <div class="hand-card-container">
      <div
        class="hand-card-position"
        *ngFor="let card of hand; let i = index"
        [style.--card-index]="i"
        (mouseenter)="focusHandCard(i)"
        (mouseleave)="unfocusHandCard()"
        (click)="selectCard.emit({ card, i })"
      >
        <sw-spell-card
          class="hand-card"
          [spell]="contentService.getSpell(card.id)!"
          [isSmall]="hoveringSpellIndex !== i"
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

        z-index: calc(10 + var(--card-index));
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
        }
      }
    }
  `,
})
export class HandComponent {
  @Input({ required: true }) public hand: PlayableCard[] = [];
  @Output() public selectCard = new EventEmitter<{
    card: PlayableCard;
    i: number;
  }>();

  public hoveringSpellIndex = -1;

  constructor(public contentService: ContentService) {}

  public focusHandCard(index: number) {
    this.hoveringSpellIndex = index;
  }

  public unfocusHandCard() {
    this.hoveringSpellIndex = -1;
  }
}
