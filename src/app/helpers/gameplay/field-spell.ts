import type { FieldSpell, Spell, TurnOrder } from '../../interfaces';
import { getId } from '../static/uuid';
import { gamestate } from './gamestate';

/**
 * Get the extra data for a field spell.
 *
 * @category Field Spell
 * @param opts.spell - The spell to get the extra data for
 * @param opts.key - The key to get from the extra data
 * @returns {unknown}
 */
export function getExtraDataForFieldSpell<T>(opts: {
  spell: FieldSpell;
  key: string;
}): T {
  const { spell, key } = opts;

  return spell.extraData[key] as T;
}

/**
 * Set the extra data for a field spell.
 *
 * @category Field Spell
 * @param opts.spell - The spell to set the extra data for
 * @param opts.key - The key to set in the extra data
 * @param opts.value - The value to set in the extra data
 */
export function setExtraDataForFieldSpell(opts: {
  spell: FieldSpell;
  key: string;
  value: unknown;
}): void {
  const { spell, key, value } = opts;

  spell.extraData[key] = value;
}

/**
 * Convert a spell to a field spell.
 *
 * @category Field Spell
 * @param opts.spell - The spell to convert
 * @param opts.caster - The caster of the spell
 * @param opts.extraData - Extra data to add to the field spell
 * @returns {FieldSpell} the new field spell
 */
export function spellToFieldSpell(opts: {
  spell: Spell;
  caster: TurnOrder;
  extraData?: Record<string, unknown>;
}): FieldSpell {
  const { spell, caster, extraData } = opts;

  return {
    ...spell,
    castId: getId(),
    caster,
    extraData: extraData ?? {},
  };
}

/**
 * Clear the field spell from a given tile.
 *
 * @category Field Spell
 * @param opts.x - The x position to clear
 * @param opts.y - The y position to clear
 */
export function clearFieldSpell(opts: { x: number; y: number }): void {
  setFieldSpell({ x: opts.x, y: opts.y, spell: undefined });
}

/**
 * Set the field spell at a given position.
 *
 * @category Field Spell
 * @param opts.x - The x position to set
 * @param opts.y - The y position to set
 * @param opts.spell - The spell to set. Can be undefined, which will clear the field spell.
 */
export function setFieldSpell(opts: {
  x: number;
  y: number;
  spell: FieldSpell | undefined;
}): void {
  const { x, y, spell } = opts;
  const { field } = gamestate();

  field[y][x].containedSpell = spell;
}
