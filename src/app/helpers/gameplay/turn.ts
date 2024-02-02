import {
  ActivePlayer,
  GamePhase,
  PlayableCard,
  TurnOrder,
} from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import { seededrng } from '../static/rng';
import {
  addSpellToCastQueue,
  getTargettableSpacesForSpellAroundPosition,
  setFieldSpell,
  spellToFieldSpell,
} from './field';
import { loseCardInHand } from './hand';
import { nextPhase } from './meta';
import { gamestate } from './signal';
import { callSpellTagFunction } from './spell';
import { manaCostForSpell, spendMana } from './stats';

export function shuffleDeck(character: ActivePlayer): void {
  const rng = seededrng();

  character.deck.sort(() => rng() - 0.5);
}

export function reshuffleDeck(character: ActivePlayer): void {
  character.deck.push(...character.discard);
  character.discard = [];

  shuffleDeck(character);
}

export function canDrawCard(character: ActivePlayer): boolean {
  const state = gamestate();

  return (
    [GamePhase.Start, GamePhase.Draw].includes(state.currentPhase) &&
    character.deck.length > 0
  );
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

  const { character, x, y, card, turnOrder } = props;

  const spellData = getSpellById(card.id);
  if (!spellData) return;

  const targetTiles = getTargettableSpacesForSpellAroundPosition({
    spell: spellData,
    x,
    y,
  });

  let placeNum = 0;
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (!targetTiles[y]?.[x]) continue;

      const newlyCastSpell = spellToFieldSpell({
        spell: spellData,
        caster: turnOrder,
      });

      addSpellToCastQueue({ spell: newlyCastSpell });
      setFieldSpell({ x, y, spell: newlyCastSpell });

      callSpellTagFunction({
        spell: newlyCastSpell,
        func: 'onSpellPlacement',
        funcOpts: { x, y, placeNum: placeNum++ },
      });
    }
  }

  loseCardInHand({ player: character, card });
  spendMana({
    character,
    amount: manaCostForSpell({ character, spell: spellData }),
  });
  addSpellCast(character);
}
