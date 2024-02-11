import { Component, EventEmitter, Output, input } from '@angular/core';
import { getSpellById } from '../../../helpers';
import { type PlayableCard, type SelectedCard } from '../../../interfaces';

@Component({
  selector: 'sw-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})
export class HandComponent {
  getSpellById = getSpellById;

  public hand = input.required<PlayableCard[]>();
  public selectedCard = input<SelectedCard>();
  public extraCost = input<number>(0);
  public highlightCastableCardCost = input<number>(0);

  @Output() public selectCard = new EventEmitter<SelectedCard>();
  @Output() public unselectCard = new EventEmitter<SelectedCard>();

  public hoveringSpellIndex = -1;

  public focusHandCard(index: number) {
    this.hoveringSpellIndex = index;
  }

  public unfocusHandCard() {
    this.hoveringSpellIndex = -1;
  }

  public unselectCardFromHand(index: number) {
    if (this.selectedCard()?.index !== index) return;
    this.unselectCard.emit();
  }
}
