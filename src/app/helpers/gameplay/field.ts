import { FieldNode, FieldSpell } from '../../interfaces';

export function setFieldSpell(
  field: FieldNode[][],
  x: number,
  y: number,
  spell: FieldSpell,
) {
  field[y][x] = {
    containedSpell: spell,
  };
}

export function castSpell(queue: string[], spell: FieldSpell) {
  queue.push(spell.castId);
}
