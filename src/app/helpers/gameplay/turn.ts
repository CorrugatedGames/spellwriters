import {
  ActivePlayer,
  FieldSpell,
  GamePhase,
  PlayableCard,
  TurnOrder,
} from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import {
  addSpellToCastQueue,
  getTargettableSpacesForSpellAroundPosition,
  setFieldSpell,
} from './field';
import { loseCardInHand } from './hand';
import { nextPhase } from './meta';
import { seededrng } from './rng';
import { gamestate } from './signal';
import { manaCostForSpell, spendMana } from './stats';
import { getId } from './uuid';

export function shuffleDeck(character: ActivePlayer): void {
  const prng = seededrng();

  character.deck.sort(() => prng() - 0.5);
}

export function reshuffleDeck(character: ActivePlayer): void {
  character.deck.push(...character.discard);
  character.discard = [];

  shuffleDeck(character);
}

export function canDrawCard(character: ActivePlayer): boolean {
  const state = gamestate();

  return state.currentPhase === GamePhase.Draw && character.deck.length > 0;
}

export function drawCard(character: ActivePlayer): void {
  if (!canDrawCard(character)) {
    return;
  }

  const card = character.deck.pop();

  if (card) {
    character.hand.push(card);
  }
}

export function drawCardAndPassPhase(character: ActivePlayer): void {
  if (!canDrawCard(character)) return;

  drawCard(character);
  nextPhase();
}

export function endTurnAndPassPhase(): void {
  nextPhase();
}

export function addSpellCast(character: ActivePlayer): void {
  character.spellsCastThisTurn++;
}

export function handleEntireSpellcastSequence(props: {
  character: ActivePlayer;
  spellQueue: string[];
  x: number;
  y: number;
  card: PlayableCard;
  turnOrder: TurnOrder;
}): void {
  const { field } = gamestate();

  const { character, spellQueue, x, y, card, turnOrder } = props;

  const spellData = getSpellById(card.id);
  if (!spellData) return;

  const targetTiles = getTargettableSpacesForSpellAroundPosition(
    spellData,
    x,
    y,
  );

  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (!targetTiles[y]?.[x]) continue;

      const newlyCastSpell: FieldSpell = {
        ...spellData,
        caster: turnOrder,
        castId: getId(),
      };

      addSpellToCastQueue(spellQueue, newlyCastSpell);
      setFieldSpell(x, y, newlyCastSpell);
    }
  }

  loseCardInHand({ player: character, card });
  spendMana({
    character,
    amount: manaCostForSpell({ character, spell: spellData }),
  });
  addSpellCast(character);
}
