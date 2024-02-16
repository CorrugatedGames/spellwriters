import type { FieldSpell, Spell, TurnOrder } from '../../interfaces';
import { getId } from '../static/uuid';
import { gamestate } from './gamestate';

export function getExtraDataForFieldSpell(opts: {
  spell: FieldSpell;
  key: string;
}): unknown {
  const { spell, key } = opts;

  return spell.extraData[key];
}

export function setExtraDataForFieldSpell(opts: {
  spell: FieldSpell;
  key: string;
  value: unknown;
}): void {
  const { spell, key, value } = opts;

  spell.extraData[key] = value;
}

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

export function clearFieldSpell(opts: { x: number; y: number }): void {
  setFieldSpell({ x: opts.x, y: opts.y, spell: undefined });
}

export function setFieldSpell(opts: {
  x: number;
  y: number;
  spell: FieldSpell | undefined;
}): void {
  const { x, y, spell } = opts;
  const { field } = gamestate();

  field[y][x].containedSpell = spell;
}
