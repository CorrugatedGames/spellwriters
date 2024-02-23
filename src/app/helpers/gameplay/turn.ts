import {
  GamePhase,
  type ActivePlayer,
  type PlayableCard,
  type TurnOrder,
} from '../../interfaces';
import { getSpellById } from '../lookup/spells';
import { seededrng } from '../static/rng';
import { getTargettableSpacesForSpellAroundPosition } from './field';
import { setFieldSpell, spellToFieldSpell } from './field-spell';
import { gamestate } from './gamestate';
import { loseCardInHand } from './hand';
import { nextPhase } from './meta';
import { callRitualGlobalFunction } from './ritual';
import { addSpellToQueue } from './spell';
import {
  healthCostForDraw,
  loseHealth,
  manaCostForSpell,
  spendMana,
} from './stats';

export function shuffleDeck(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  const rng = seededrng();

  character.deck.sort(() => rng() - 0.5);
}

export function reshuffleDeck(opts: { character: ActivePlayer }): void {
  const { character } = opts;

  character.deck.push(...character.discard);
  character.discard = [];

  shuffleDeck({ character });
}

export function canDrawCard(opts: { character: ActivePlayer }): boolean {
  const { character } = opts;
  const state = gamestate();

  return (
    [GamePhase.Start, GamePhase.Draw].includes(state.currentPhase) &&
    character.deck.length > 0
  );
}

export function canDrawExtraCard(opts: { character: ActivePlayer }): boolean {
  const { character } = opts;
  const state = gamestate();

  return (
    [GamePhase.Turn].includes(state.currentPhase) &&
    character.deck.length > 0 &&
    character.health > healthCostForDraw({ character })
  );
}

export function drawCard(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  const card = character.deck.pop();

  if (card) {
    character.hand.push(card);
  }
}

export function drawCardAndPassPhase(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  if (!canDrawCard({ character })) return;

  drawCard({ character });
  nextPhase();
}

export function doExtraCardDraw(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  if (!canDrawExtraCard({ character })) return;

  loseHealth({ character, amount: healthCostForDraw({ character }) });
  drawCard({ character });
  addCardDraw({ character });
}

export function endTurnAndPassPhase(): void {
  nextPhase();
}

export function addSpellCast(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  character.spellsCastThisTurn++;
}

export function addCardDraw(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  character.cardsDrawnThisTurn++;
}

export function handleEntireSpellcastSequence(opts: {
  character: ActivePlayer;
  spellQueue: string[];
  x: number;
  y: number;
  card: PlayableCard;
  turnOrder: TurnOrder;
}): void {
  const { field } = gamestate();

  const { character, x, y, card, turnOrder } = opts;

  const spellData = getSpellById(card.spellId);
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

      addSpellToQueue({ spell: newlyCastSpell });
      setFieldSpell({ x, y, spell: newlyCastSpell });

      callRitualGlobalFunction({
        func: 'onSpellPlaced',
        funcOpts: { spell: newlyCastSpell, x, y, placeNum: placeNum++ },
      });
    }
  }

  loseCardInHand({ player: character, card });
  spendMana({
    character,
    amount: manaCostForSpell({ character, spell: spellData }),
  });
  addSpellCast({ character });
}
