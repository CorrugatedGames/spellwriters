import {
  Component,
  input,
  output,
  type OnChanges
} from '@angular/core';
import {
  getListOfTargetableTilesForSpellBasedOnPattern,
  getSpellById,
} from '../../../helpers';
import {
  TurnOrder,
  type PlayableCard,
  type SelectedCard,
  type Spell,
} from '../../../interfaces';

@Component({
  selector: 'sw-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})
export class HandComponent implements OnChanges {
  getSpellById = getSpellById;

  public hand = input.required<PlayableCard[]>();
  public selectedCard = input<SelectedCard>();
  public extraCost = input<number>(0);
  public highlightCastableCardCost = input<number>(0);

  public shouldGlow: boolean[] = [];

  public selectCard = output<SelectedCard>();
  public unselectCard = output<void>();

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

  public calcShouldGlow(spell: Spell) {
    const targettableTiles = getListOfTargetableTilesForSpellBasedOnPattern({
      spell,
      turn: TurnOrder.Player,
    });

    if (targettableTiles.length === 0) return false;

    if (this.highlightCastableCardCost() > 0) {
      return spell.cost <= this.highlightCastableCardCost();
    }

    return false;
  }

  ngOnChanges() {
    this.shouldGlow = this.hand().map((card) => {
      const spell = getSpellById(card.spellId);
      if (!spell) return false;

      return this.calcShouldGlow(spell);
    });
  }
}
