import {
  ElementalCollision,
  FieldNode,
  FieldSpell,
  Spell,
  SpellEffect,
  SpellPattern,
  TurnOrder,
} from '../../interfaces';
import { delay } from '../static/time';
import { loseHealth } from './stats';

import * as ElementalCollisions from './collisions';
import { createBlankFieldRecord } from './init';
import { hasAnyoneWon } from './meta';
import { gamestate } from './signal';
import { defaultCollisionDamageReduction, isSpellDead } from './spell';

const AllElementalCollisions: Record<SpellEffect, ElementalCollision> =
  ElementalCollisions;

export function setFieldSpell(opts: {
  x: number;
  y: number;
  spell: FieldSpell | undefined;
}): void {
  const { x, y, spell } = opts;
  const { field } = gamestate();

  field[y][x].containedSpell = spell;
}

export function setFieldEffect(opts: {
  x: number;
  y: number;
  effect: SpellEffect | undefined;
}): void {
  const { x, y, effect } = opts;
  const { field } = gamestate();
  field[y][x].containedEffect = effect ? { effect } : undefined;
}

export function addSpellToCastQueue(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { spellQueue } = gamestate();

  spellQueue.push(spell.castId);
}

export function findSpellOnField(opts: {
  spellId: string;
}): FieldSpell | undefined {
  const { spellId } = opts;
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

export function findSpellPositionOnField(opts: {
  spellId: string;
}): { x: number; y: number } | undefined {
  const { spellId } = opts;
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

export function getSpaceFromField(opts: {
  x: number;
  y: number;
}): FieldNode | undefined {
  const { field } = gamestate();
  const { x, y } = opts;

  return field[y]?.[x];
}

export function isFieldSpaceEmpty(opts: { x: number; y: number }): boolean {
  const { x, y } = opts;

  const node = getSpaceFromField({ x, y });
  if (!node) return false;

  return !node.containedSpell && !node.containedEffect;
}

export function getTargettableSpacesForSpellAroundPosition(opts: {
  spell: Spell;
  x: number;
  y: number;
}): Record<number, Record<number, Spell>> {
  const { spell, x, y } = opts;
  const { width, height } = gamestate();

  const targetField = createBlankFieldRecord({ width, height });

  const setInTargetField = (x: number, y: number) => {
    if (!isFieldSpaceEmpty({ x, y })) return;

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

export function removeSpellFromField(opts: { spellId: string }): void {
  const { spellId } = opts;
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

export function moveSpellForwardOneStep(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { field, players } = gamestate();

  const position = findSpellPositionOnField({ spellId: spell.castId });
  if (!position) return;

  const yDelta = spell.caster === TurnOrder.Player ? -1 : 1;
  const nextY = position.y + yDelta;
  const nextX = position.x;

  // get our current tile
  const currentTile = field[position.y][position.x];

  setFieldSpell({ x: position.x, y: position.y, spell: undefined });

  // check if we have a next tile
  const nextTile = field[nextY]?.[position.x];
  if (!nextTile || nextY === 0 || nextY === field.length - 1) {
    const opponentRef =
      spell.caster === TurnOrder.Player
        ? players[TurnOrder.Opponent]
        : players[TurnOrder.Player];

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

export async function handleEndOfTurnSpellActions(): Promise<void> {
  const { spellQueue, currentTurn } = gamestate();

  await delay(200);

  const queue = spellQueue.filter(
    (spellId) => findSpellOnField({ spellId })?.caster === currentTurn,
  );

  await Promise.all([
    ...queue.map(async (spellId: string, i) => {
      await delay(200 * i);

      if (hasAnyoneWon()) return;

      const spell = findSpellOnField({ spellId });
      if (!spell) return;

      if (spell.castTime > 0) {
        lowerSpellTimer(spell);
        return;
      }

      const numSteps = spell.speed;
      await Promise.all(
        [...Array(numSteps)].map(async (_, i) => {
          await delay(75 * i);

          moveSpellForwardOneStep({ spell });
        }),
      );
    }),
  ]);

  await delay(200);
}
