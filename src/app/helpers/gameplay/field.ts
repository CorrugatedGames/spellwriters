import {
  ElementalCollision,
  FieldNode,
  FieldSpell,
  GameState,
  Spell,
  SpellEffect,
  SpellPattern,
  TurnOrder,
} from '../../interfaces';
import { loseHealth } from './stats';
import { delay } from './time';

import * as ElementalCollisions from './collisions';
import { createBlankFieldRecord } from './init';
import { gamestate } from './signal';
import { defaultCollisionDamageReduction, isSpellDead } from './spell';
const AllElementalCollisions: Record<SpellEffect, ElementalCollision> =
  ElementalCollisions;

export function setFieldSpell(
  x: number,
  y: number,
  spell: FieldSpell | undefined,
): void {
  const { field } = gamestate();

  field[y][x].containedSpell = spell;
}

export function setFieldEffect(
  x: number,
  y: number,
  effect: SpellEffect | undefined,
): void {
  const { field } = gamestate();
  field[y][x].containedEffect = effect ? { effect } : undefined;
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

export function getSpaceFromField(
  field: FieldNode[][],
  x: number,
  y: number,
): FieldNode | undefined {
  return field[y]?.[x];
}

export function isFieldSpaceEmpty(
  field: FieldNode[][],
  x: number,
  y: number,
): boolean {
  const node = getSpaceFromField(field, x, y);
  if (!node) return false;

  return !node.containedSpell && !node.containedEffect;
}

export function getTargettableSpacesForSpellAroundPosition(
  spell: Spell,
  x: number,
  y: number,
): Record<number, Record<number, Spell>> {
  const { field, width, height } = gamestate();
  const targetField = createBlankFieldRecord({ width, height });

  const setInTargetField = (x: number, y: number) => {
    if (!isFieldSpaceEmpty(field, x, y)) return;

    targetField[y][x] = spell;
  };

  switch (spell.pattern) {
    case SpellPattern.Single: {
      setInTargetField(x, y);
      break;
    }

    case SpellPattern.Double: {
      setInTargetField(x, y);
      setInTargetField(x + 1, y);
      break;
    }

    case SpellPattern.Triple: {
      setInTargetField(x - 1, y);
      setInTargetField(x, y);
      setInTargetField(x + 1, y);
      break;
    }

    case SpellPattern.Wide: {
      setInTargetField(x - 2, y);
      setInTargetField(x - 1, y);
      setInTargetField(x, y);
      setInTargetField(x + 1, y);
      setInTargetField(x + 2, y);
      break;
    }
  }

  return targetField as Record<number, Record<number, Spell>>;
}

export function removeSpellFromField(spellId: string): void {
  const { field, spellQueue } = gamestate();

  const index = spellQueue.indexOf(spellId);
  if (index !== -1) {
    spellQueue.splice(index, 1);
  }

  for (const row of field) {
    for (const node of row) {
      if (node.containedSpell?.castId === spellId) {
        node.containedSpell = undefined;
      }
    }
  }
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

  setFieldSpell(position.x, position.y, undefined);

  // check if we have a next tile
  const nextTile = field[nextY]?.[position.x];
  if (!nextTile || nextY === 0 || nextY === field.length - 1) {
    const opponentRef =
      spell.caster === TurnOrder.Player
        ? state.players[TurnOrder.Opponent]
        : state.players[TurnOrder.Player];

    loseHealth({ character: opponentRef, amount: spell.damage });
    return;
  }

  let shouldMoveToNextTile = true;

  if (nextTile.containedSpell) {
    const containedSpell = nextTile.containedSpell;

    defaultCollisionDamageReduction({
      collider: spell,
      collidee: containedSpell,
    });

    if (isSpellDead({ spell })) {
      shouldMoveToNextTile = false;
    }

    Object.keys(AllElementalCollisions).forEach((key) => {
      const collision = AllElementalCollisions[key as SpellEffect];
      const collisionArgs = () => ({
        collider: spell,
        collidee: containedSpell,
      });

      if (collision.hasCollisionReaction(collisionArgs())) {
        collision.collide(collisionArgs());

        if (collision.collisionWinner(collisionArgs()) !== spell) {
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
        collisionEffect.onSpellExit({
          currentTile: { x: position.x, y: position.y },
          nextTile: { x: nextX, y: nextY },
          spell,
        });
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
        collisionEffect.onSpellEnter({
          previousTile: { x: position.x, y: position.y },
          currentTile: { x: nextX, y: nextY },
          spell,
        });
      }
    }
  }
}

export function lowerSpellTimer(spell: FieldSpell): void {
  spell.castTime--;
}

export async function handleEndOfTurnSpellActions(
  state: GameState,
): Promise<void> {
  await delay(200);

  const queue = state.spellQueue.filter(
    (spellId) => findSpellOnField(spellId)?.caster === state.currentTurn,
  );

  await Promise.all([
    ...queue.map(async (spellId: string, i) => {
      await delay(200 * i);

      const spell = findSpellOnField(spellId);
      if (!spell) return;

      if (spell.castTime > 0) {
        lowerSpellTimer(spell);
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
