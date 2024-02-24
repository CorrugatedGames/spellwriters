import { type ActivePlayer, type Spell } from '../../interfaces';
import { callRitualGlobalFunction } from './ritual';

/**
 * Set the mana for a player.
 * You probably want to do `gainMana` or `spendMana` instead. This function does not call any events.
 *
 * @category Stats
 * @param opts.character The player to set the mana for.
 * @param opts.amount The amount of mana to set.
 */
export function setMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.mana = Math.max(0, Math.min(amount, character.maxMana));
}

/**
 * Gain mana for a player.
 *
 * @category Stats
 * @param opts.character The player to gain mana for.
 * @param opts.amount The amount of mana to gain.
 */
export function gainMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setMana({ character, amount: character.mana + amount });

  callRitualGlobalFunction({
    func: 'onPlayerGainMana',
    funcOpts: { character, mana: amount },
  });
}

/**
 * Spend mana for a player.
 *
 * @category Stats
 * @param opts.character The player to spend mana for.
 * @param opts.amount The amount of mana to spend.
 */
export function spendMana(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setMana({ character, amount: character.mana - amount });

  callRitualGlobalFunction({
    func: 'onPlayerLoseMana',
    funcOpts: { character, mana: amount },
  });
}

/**
 * Get the cost of drawing an extra card for a player. Will be the number of cards drawn this turn plus 1.
 *
 * @category Stats
 * @param opts.character The player to get the cost for.
 * @returns the cost of drawing a card.
 */
export function healthCostForDraw(opts: { character: ActivePlayer }): number {
  const { character } = opts;
  return character.cardsDrawnThisTurn + 1;
}

/**
 * Get the cost of casting an extra spell for a player. Will be the number of spells cast this turn plus the spell's cost.
 *
 * @category Stats
 * @param opts.character The player to get the cost for.
 * @param opts.spell The spell to get the cost for.
 * @returns the cost of casting a spell.
 */
export function manaCostForSpell(opts: {
  character: ActivePlayer;
  spell: Spell;
}): number {
  const { character, spell } = opts;
  return spell.cost + character.spellsCastThisTurn;
}

/**
 * Set the health for a player.
 * You probably want to do `gainHealth` or `loseHealth` instead. This function does not call any events.
 *
 * @category Stats
 * @param opts.character The player to set the health for.
 * @param opts.amount The amount of health to set.
 */
export function setHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;

  character.health = Math.max(0, Math.min(amount, character.maxHealth));
}

/**
 * Gain health for a player.
 *
 * @category Stats
 * @param opts.character The player to gain health for.
 * @param opts.amount The amount of health to gain.
 */
export function gainHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setHealth({ character, amount: character.health + amount });

  callRitualGlobalFunction({
    func: 'onPlayerGainHealth',
    funcOpts: { character, health: amount },
  });
}

/**
 * Lose health for a player.
 *
 * @category Stats
 * @param opts.character The player to lose health for.
 * @param opts.amount The amount of health to lose.
 */
export function loseHealth(opts: {
  character: ActivePlayer;
  amount: number;
}): void {
  const { character, amount } = opts;
  setHealth({ character, amount: character.health - amount });

  callRitualGlobalFunction({
    func: 'onPlayerLoseHealth',
    funcOpts: { character, health: amount },
  });
}
