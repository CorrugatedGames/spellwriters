import { FieldNode, Spell } from '../../interfaces';

export function setFieldSpell(
  field: FieldNode[][],
  x: number,
  y: number,
  spell: Spell,
) {
  field[y][x] = {
    containedSpell: spell,
  };
}
