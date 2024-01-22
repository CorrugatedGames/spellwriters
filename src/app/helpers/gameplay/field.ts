import { FieldNode, FieldSpell, GameState, TurnOrder } from '../../interfaces';
import { loseHealth } from './stats';
import { delay } from './time';

export function setFieldSpell(
  field: FieldNode[][],
  x: number,
  y: number,
  spell: FieldSpell,
): void {
  field[y][x] = {
    containedSpell: spell,
  };
}

export function addSpellToCastQueue(queue: string[], spell: FieldSpell): void {
  queue.push(spell.castId);
}

export function findSpellOnField(
  field: FieldNode[][],
  spellId: string,
): FieldSpell | undefined {
  for (const row of field) {
    for (const node of row) {
      if (node.containedSpell?.castId === spellId) {
        return node.containedSpell;
      }
    }
  }

  return undefined;
}

export function findSpellPositionOnField(
  field: FieldNode[][],
  spellId: string,
): { x: number; y: number } | undefined {
  for (const [y, row] of field.entries()) {
    for (const [x, node] of row.entries()) {
      if (node.containedSpell?.castId === spellId) {
        return { x, y };
      }
    }
  }

  return undefined;
}

export function moveSpellForwardOneStep(
  state: GameState,
  spell: FieldSpell,
): void {
  const field = state.field;
  const position = findSpellPositionOnField(field, spell.castId);
  if (!position) return;

  const yDelta = spell.caster === TurnOrder.Player ? -1 : 1;
  const nextY = position.y + yDelta;

  // get our current tile
  const currentTile = field[position.y][position.x];

  field[position.y][position.x] = {
    ...currentTile,
    containedSpell: undefined,
  };

  // check if we have a next tile
  const nextTile = field[nextY]?.[position.x];
  if (!nextTile || nextY === 0 || nextY === field.length - 1) {
    const opponentRef =
      spell.caster === TurnOrder.Player
        ? state.players[TurnOrder.Opponent]
        : state.players[TurnOrder.Player];

    loseHealth(opponentRef, spell.damage);
    return;
  }

  if (nextTile.containedSpell) {
    console.log('collision!');
    return;
  }

  field[nextY][position.x] = {
    ...nextTile,
    containedSpell: spell,
  };

  console.log('move', spell);
}

export function lowerSpellTimer(field: FieldNode[][], spell: FieldSpell): void {
  spell.castTime--;
}

export async function handleEndOfTurnSpellActions(
  state: GameState,
): Promise<void> {
  await delay(200);

  const queue = state.spellQueue;

  await Promise.all([
    ...queue.map(async (spellId: string, i) => {
      await delay(200 * i);

      const spell = findSpellOnField(state.field, spellId);
      if (!spell) return;

      if (spell.castTime > 0) {
        lowerSpellTimer(state.field, spell);
        return;
      }

      const numSteps = spell.speed;
      await Promise.all(
        [...Array(numSteps)].map(async (_, i) => {
          await delay(75 * i);

          moveSpellForwardOneStep(state, spell);
        }),
      );
    }),
  ]);

  await delay(200);
}
