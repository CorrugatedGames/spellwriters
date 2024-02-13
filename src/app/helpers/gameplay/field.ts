import {
  SpellStatImpl,
  TurnOrder,
  type FieldElement,
  type FieldNode,
  type FieldSpell,
  type Spell,
  type SpellElement,
} from '../../interfaces';
import { delay } from '../static/time';
import { loseHealth } from './stats';

import {
  getAllElementalCollisionImpls,
  getElementByKey,
  getElementCollisionImplByKey,
} from '../lookup/elements';
import { getSpellPatternImpl } from '../lookup/spell-patterns';
import { getId } from '../static/uuid';
import { createBlankFieldRecord } from './init';
import { hasAnyoneWon } from './meta';
import { callRitualGlobalFunction } from './ritual';
import { gamestate } from './signal';
import {
  defaultCollisionDamageReduction,
  isSpellDead,
  setSpellStat,
} from './spell';

export function spellToFieldSpell(opts: {
  spell: Spell;
  caster: TurnOrder;
}): FieldSpell {
  const { spell, caster } = opts;

  return {
    ...spell,
    castId: getId(),
    caster,
  };
}

export function elementToFieldElement(opts: {
  element: SpellElement;
  caster: TurnOrder;
}): FieldElement {
  const { element, caster } = opts;

  return {
    ...element,
    castId: getId(),
    caster,
  };
}

export function elementKeyToFieldElement(opts: {
  elementKey: string;
  caster: TurnOrder;
}): FieldElement {
  const { elementKey, caster } = opts;

  const element = getElementByKey(elementKey);
  if (!element) throw new Error(`No element for ${elementKey}`);

  return elementToFieldElement({ element, caster });
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

export function clearFieldElement(opts: { x: number; y: number }): void {
  setFieldElement({ x: opts.x, y: opts.y, element: undefined });
}

export function setFieldElement(opts: {
  x: number;
  y: number;
  element: FieldElement | undefined;
}): void {
  const { x, y, element } = opts;
  const { field } = gamestate();

  if (!element) {
    field[y][x].containedElement = undefined;
    return;
  }

  field[y][x].containedElement = element;
}

export function addSpellToQueue(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { spellQueue } = gamestate();

  spellQueue.push(spell.castId);
}

export function findSpellsOnField(): Array<{
  x: number;
  y: number;
  spell: FieldSpell;
}> {
  const { field } = gamestate();

  const ret: Array<{ x: number; y: number; spell: FieldSpell }> = [];

  for (const [y, row] of field.entries()) {
    for (const [x, node] of row.entries()) {
      if (!node.containedSpell) continue;
      ret.push({ x, y, spell: node.containedSpell });
    }
  }

  return ret;
}

export function getFieldSpaces(): Array<{
  x: number;
  y: number;
}> {
  const { field } = gamestate();

  const ret: Array<{ x: number; y: number }> = [];

  for (const [y, row] of field.entries()) {
    for (const [x] of row.entries()) {
      ret.push({ x, y });
    }
  }

  return ret;
}

export function getTargettableFieldSpaces(): Array<{
  x: number;
  y: number;
}> {
  const { field } = gamestate();
  const allFieldSpaces = getFieldSpaces();

  return allFieldSpaces.filter(
    (space) => space.y !== 0 && space.y !== field.length - 1,
  );
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

  return !node.containedSpell && !node.containedElement;
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

  const allTiles =
    getSpellPatternImpl(spell.pattern)?.getFieldNodesBasedOnTarget({
      x,
      y,
    }) ?? [];
  allTiles.forEach((tile) => {
    setInTargetField(tile.x, tile.y);
  });

  return targetField as Record<number, Record<number, Spell>>;
}

export function removeSpellFromQueue(opts: { spellId: string }): void {
  const { spellId } = opts;
  const { spellQueue } = gamestate();

  const index = spellQueue.indexOf(spellId);
  if (index !== -1) {
    spellQueue.splice(index, 1);
  }
}

export function removeSpellFromField(opts: {
  spellId: string;
  fullRemoval: boolean;
}): void {
  const { spellId, fullRemoval } = opts;
  const { field } = gamestate();

  const fieldSpell = findSpellOnField({ spellId });
  if (!fieldSpell) return;

  if (fullRemoval) {
    removeSpellFromQueue({ spellId });

    callRitualGlobalFunction({
      func: 'onSpellRemoval',
      funcOpts: { spell: fieldSpell },
    });
  }

  for (const row of field) {
    for (const node of row) {
      if (node.containedSpell?.castId === spellId) {
        node.containedSpell = undefined;
      }
    }
  }
}

export function moveSpellToPosition(opts: {
  spell: FieldSpell;
  currentX: number;
  currentY: number;
  nextX: number;
  nextY: number;
  disallowEntryIntoNextTile?: boolean;
}): void {
  const { spell, nextX, nextY, currentX, currentY, disallowEntryIntoNextTile } =
    opts;
  const { field, players } = gamestate();

  // get our current tile
  const currentTile = getSpaceFromField({ x: currentX, y: currentY });
  if (!currentTile) return;

  const removeMovingSpellFromField = (fullRemoval: boolean) => {
    if (currentTile.containedSpell?.castId !== spell.castId) return;

    removeSpellFromField({ spellId: spell.castId, fullRemoval });
  };

  // check if we have a next tile
  const nextTile = getSpaceFromField({ x: nextX, y: nextY });
  if (!nextTile || nextY === 0 || nextY === field.length - 1) {
    const opponentRef =
      spell.caster === TurnOrder.Player
        ? players[TurnOrder.Opponent]
        : players[TurnOrder.Player];

    loseHealth({ character: opponentRef, amount: spell.damage });

    callRitualGlobalFunction({
      func: 'onSpellDealDamage',
      funcOpts: { spell, damage: spell.damage },
    });

    removeMovingSpellFromField(true);
    return;
  }

  let shouldMoveToNextTile = true;

  // first, we collide with a spell to see if we even can move into that space
  const containedSpell = nextTile.containedSpell;
  if (containedSpell) {
    const collisionArgs = {
      collider: spell,
      collidee: containedSpell,
      collisionX: nextX,
      collisionY: nextY,
    };

    callRitualGlobalFunction({
      func: 'onSpellCollision',
      funcOpts: {
        spell: collisionArgs.collider,
        collidedWith: collisionArgs.collidee,
        collisionX: nextX,
        collisionY: nextY,
      },
    });

    callRitualGlobalFunction({
      func: 'onSpellCollision',
      funcOpts: {
        spell: collisionArgs.collidee,
        collidedWith: collisionArgs.collider,
        collisionX: nextX,
        collisionY: nextY,
      },
    });

    defaultCollisionDamageReduction({
      collider: spell,
      collidee: containedSpell,
    });

    if (isSpellDead({ spell })) {
      shouldMoveToNextTile = false;
    }

    getAllElementalCollisionImpls().forEach((collision) => {
      if (collision.hasCollisionReaction(collisionArgs)) {
        collision.collide(collisionArgs);

        if (collision.collisionWinner(collisionArgs) !== spell) {
          shouldMoveToNextTile = false;
        }
      }
    });
  }

  // next, we check if we're allowed to move via tags
  if (shouldMoveToNextTile && !disallowEntryIntoNextTile) {
    const canEnter = (
      callRitualGlobalFunction({
        func: 'onSpellSpaceEnter',
        funcOpts: { spell, x: nextX, y: nextY },
      }) as boolean[]
    ).every(Boolean);

    const canExit = (
      callRitualGlobalFunction({
        func: 'onSpellSpaceExit',
        funcOpts: { spell, x: currentX, y: currentY },
      }) as boolean[]
    ).every(Boolean);

    if (!canEnter || !canExit) {
      shouldMoveToNextTile = false;
    }
  }

  // lastly, we do the real movement
  if (shouldMoveToNextTile) {
    // do effects for our current spell leaving
    if (currentTile.containedElement) {
      const containedElement = currentTile.containedElement;

      const collisionEffect = getElementCollisionImplByKey(
        containedElement.key,
      );
      if (collisionEffect) {
        collisionEffect.onSpellExit({
          currentTile: { x: currentX, y: currentY },
          nextTile: { x: nextX, y: nextY },
          spell,
        });
      }
    }

    // if the next tile can't be entered, we don't allow it to happen
    if (!disallowEntryIntoNextTile) {
      // move our spell

      callRitualGlobalFunction({
        func: 'onSpellSpaceExited',
        funcOpts: { spell, x: currentX, y: currentY },
      });

      removeMovingSpellFromField(false);

      setFieldSpell({ x: nextX, y: nextY, spell });

      callRitualGlobalFunction({
        func: 'onSpellSpaceEntered',
        funcOpts: { spell, x: nextX, y: nextY },
      });
    }

    // do effects for our next spell entering
    if (nextTile.containedElement) {
      const containedElement = nextTile.containedElement;

      const collisionEffect = getElementCollisionImplByKey(
        containedElement.key,
      );
      if (collisionEffect) {
        collisionEffect.onSpellEnter({
          previousTile: { x: currentX, y: currentY },
          currentTile: { x: nextX, y: nextY },
          spell,
        });
      }
    }
  }
}

export function moveSpellForwardOneStep(opts: { spell: FieldSpell }): void {
  const { spell } = opts;

  const position = findSpellPositionOnField({ spellId: spell.castId });
  if (!position) return;

  const yDelta = spell.caster === TurnOrder.Player ? -1 : 1;
  const nextY = position.y + yDelta;
  const nextX = position.x;

  moveSpellToPosition({
    spell,
    currentX: position.x,
    currentY: position.y,
    nextX,
    nextY,
  });
}

export function lowerSpellTimer(spell: FieldSpell): void {
  setSpellStat({
    spell,
    stat: SpellStatImpl.CastTime,
    value: Math.max(0, spell.castTime - 1),
  });
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
