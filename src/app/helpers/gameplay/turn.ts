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

/**
 * Shuffle a player's deck.
 *
 * @category Gameplay
 * @param opts.character The player whose deck is getting shuffled.
 */
export function shuffleDeck(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  const rng = seededrng();

  character.deck.sort(() => rng() - 0.5);
}

/**
 * Reshuffle a player's deck, moving all cards from the discard pile to the deck and shuffling.
 *
 * @category Gameplay
 * @param opts.character The player whose deck is getting reshuffled.
 */
export function reshuffleDeck(opts: { character: ActivePlayer }): void {
  const { character } = opts;

  character.deck.push(...character.discard);
  character.discard = [];

  shuffleDeck({ character });
}

/**
 * Whether or not a player can draw a card.
 *
 * @category Gameplay
 * @param opts.character The player drawing the card.
 */
export function canDrawCard(opts: { character: ActivePlayer }): boolean {
  const { character } = opts;
  const state = gamestate();

  return (
    [GamePhase.Start, GamePhase.Draw].includes(state.currentPhase) &&
    character.deck.length > 0
  );
}

/**
 * Whether or not a player has enough HP to draw an extra card.
 * The Knife costs 1 + 1 HP per card drawn this turn to draw an extra card.
 *
 * @category Gameplay
 * @param opts.character The player drawing the card.
 */
export function canDrawExtraCard(opts: { character: ActivePlayer }): boolean {
  const { character } = opts;
  const state = gamestate();

  return (
    [GamePhase.Turn].includes(state.currentPhase) &&
    character.deck.length > 0 &&
    character.health > healthCostForDraw({ character })
  );
}

/**
 * Draw a card from a player's deck and add it to their hand.
 *
 * @category Gameplay
 * @param opts.character The player drawing the card.
 */
export function drawCard(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  const card = character.deck.pop();

  if (card) {
    character.hand.push(card);
  }
}

/**
 * Draw a card and pass the phase to the next phase. Used when drawing a card from the deck.
 *
 * @internal
 * @category Gameplay
 * @param opts.character The player drawing the card.
 */
export function drawCardAndPassPhase(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  if (!canDrawCard({ character })) return;

  drawCard({ character });
  nextPhase();
}

/**
 * Lose health to draw an extra card.
 * The Knife costs 1 + 1 HP per card drawn this turn to draw an extra card.
 *
 * @category Gameplay
 * @param opts.character The player drawing the card.
 */
export function doExtraCardDraw(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  if (!canDrawExtraCard({ character })) return;

  loseHealth({ character, amount: healthCostForDraw({ character }) });
  drawCard({ character });
  addCardDraw({ character });
}

/**
 * End the current turn and pass the phase to the next phase.
 *
 * @category Gameplay
 * @internal
 */
export function endTurnAndPassPhase(): void {
  nextPhase();
}

/**
 * Add a spell cast to a player's turn. Used to determine how many spells they can cast in a turn.
 *
 * @category Gameplay
 * @internal
 * @param opts.character The player casting the spell.
 */
export function addSpellCast(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  character.spellsCastThisTurn++;
}

/**
 * Add a card draw to a player's turn. Used to determine how many cards they can draw in a turn.
 *
 * @category Gameplay
 * @internal
 * @param opts.character The player drawing the card.
 */
export function addCardDraw(opts: { character: ActivePlayer }): void {
  const { character } = opts;
  character.cardsDrawnThisTurn++;
}

/**
 * Handle the casting of a spell. This includes adding the spell to the spell queue, setting the spell on the field, and handling any other effects of the spell.
 *
 * @category Gameplay
 * @internal
 * @param opts.character The player casting the spell.
 * @param opts.x The x position of the spell.
 * @param opts.y The y position of the spell.
 * @param opts.card The card being cast.
 * @param opts.turnOrder The current turn order.
 */
export function handleEntireSpellcastSequence(opts: {
  character: ActivePlayer;
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
