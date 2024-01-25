import {
  ElementalCollision,
  FieldNode,
  FieldSpell,
  GameState,
  SpellEffect,
  TurnOrder,
} from '../../interfaces';
import { loseHealth } from './stats';
import { delay } from './time';

import * as ElementalCollisions from './collisions';
import { gamestate } from './signal';
const AllElementalCollisions: Record<SpellEffect, ElementalCollision> =
  ElementalCollisions;

export function setFieldSpell(
  field: FieldNode[][],
  x: number,
  y: number,
  spell: FieldSpell,
): void {
  field[y][x] = {
    ...field[y][x],
    containedSpell: spell,
  };
}

export function setFieldEffect(
  field: FieldNode[][],
  x: number,
  y: number,
  effect: SpellEffect,
): void {
  field[y][x] = {
    ...field[y][x],
    containedEffect: { effect },
  };
}

export function addSpellToCastQueue(queue: string[], spell: FieldSpell): void {
  queue.push(spell.castId);
}

export function findSpellOnField(spellId: string): FieldSpell | undefined {
  const { field } = gamestate();
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
  spellId: string,
): { x: number; y: number } | undefined {
  const { field } = gamestate();
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
  const position = findSpellPositionOnField(spell.castId);
  if (!position) return;

  const yDelta = spell.caster === TurnOrder.Player ? -1 : 1;
  const nextY = position.y + yDelta;
  const nextX = position.x;

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

  let shouldMoveToNextTile = true;

  if (nextTile.containedSpell) {
    const containedSpell = nextTile.containedSpell;

    Object.keys(AllElementalCollisions).forEach((key) => {
      const collision = AllElementalCollisions[key as SpellEffect];
      if (collision.hasCollisionReaction(spell, containedSpell)) {
        collision.collide(state, spell, containedSpell);

        if (collision.collisionWinner(spell, containedSpell) !== spell) {
          shouldMoveToNextTile = false;
        }
      }
    });
  }

  if (shouldMoveToNextTile) {
    // do effects for our current spell leaving
    if (currentTile.containedEffect) {
      const containedEffect = currentTile.containedEffect;

      const collisionEffect = AllElementalCollisions[containedEffect.effect];
      if (collisionEffect) {
        collisionEffect.onSpellExit(state, spell);
      }
    }

    // move our spell
    field[nextY][nextX] = {
      ...nextTile,
      containedSpell: spell,
    };

    // do effects for our next spell entering
    if (nextTile.containedEffect) {
      const containedEffect = nextTile.containedEffect;

      const collisionEffect = AllElementalCollisions[containedEffect.effect];
      if (collisionEffect) {
        collisionEffect.onSpellEnter(state, spell);
      }
    }
  }
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

      const spell = findSpellOnField(spellId);
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
