import {
  CombatTurnOrder,
  type FieldNode,
  type FieldSpell,
  type RitualPickableTile,
  type Spell,
} from '../../interfaces';
import { delay } from '../static/time';
import { loseHealth } from './stats';

import {
  getAllElementalCollisionImpls,
  getElementCollisionImplByKey,
} from '../lookup/elements';
import { getSpellPatternImpl } from '../lookup/spell-patterns';
import { randomChoice } from '../static/rng';
import { combatState } from './combatstate';
import { setFieldSpell } from './field-spell';
import { createBlankFieldRecord } from './init';
import { hasAnyoneWon } from './meta';
import { callRitualGlobalFunction } from './ritual';
import {
  isSpellDead,
  lowerSpellTimer,
  removeSpellFromQueue,
  spellCollisionDamageReduction,
} from './spell';
import { canPlaceSpellOnTile } from './targetting';

/**
 * Find all spells on the field, including those in secret zones.
 *
 * @category Field
 * @category Spell
 * @returns {Array<{ x: number; y: number; spell: FieldSpell }>}
 */
export function findSpellsOnField(): Array<{
  x: number;
  y: number;
  spell: FieldSpell;
}> {
  const { field } = combatState();

  const ret: Array<{ x: number; y: number; spell: FieldSpell }> = [];

  for (const [y, row] of field.entries()) {
    for (const [x, node] of row.entries()) {
      if (!node.containedSpell) continue;
      ret.push({ x, y, spell: node.containedSpell });
    }
  }

  return ret;
}

/**
 * Find all known spells on the field, excluding those in secret zones.
 *
 * @category Field
 * @category Spell
 * @returns {Array<{ x: number; y: number; spell: FieldSpell }>}
 */
export function findKnownSpellsOnField(): Array<{
  x: number;
  y: number;
  spell: FieldSpell;
}> {
  const { field } = combatState();
  const allSpells = findSpellsOnField();
  return allSpells.filter(
    (tile) => tile.y !== 0 && tile.y !== field.length - 1,
  );
}

/**
 * Get a list of all field spaces.
 *
 * @category Field
 * @returns {Array<{ x: number; y: number }>}
 */
export function getFieldSpaces(): Array<{
  x: number;
  y: number;
}> {
  const { field } = combatState();

  const ret: Array<{ x: number; y: number }> = [];

  for (const [y, row] of field.entries()) {
    for (const [x] of row.entries()) {
      ret.push({ x, y });
    }
  }

  return ret;
}

/**
 * Get a list of field spaces that can be targeted by spells.
 *
 * @category Field
 * @category Spell
 * @returns {Array<{ x: number; y: number }>}
 */
export function getTargettableFieldSpaces(): Array<{
  x: number;
  y: number;
}> {
  const { field } = combatState();
  const allFieldSpaces = getFieldSpaces();

  return allFieldSpaces.filter(
    (space) => space.y !== 0 && space.y !== field.length - 1,
  );
}

/**
 * Find a particular spell by its randomly generated ID (not content ID) on the field.
 *
 * @category Field
 * @category Spell
 * @param opts.spellId the spell ID to search for
 * @returns {FieldSpell | undefined}
 */
export function findSpellOnField(opts: {
  spellId: string;
}): FieldSpell | undefined {
  const { spellId } = opts;
  const { field } = combatState();

  for (const row of field) {
    for (const node of row) {
      if (node.containedSpell?.castId === spellId) {
        return node.containedSpell;
      }
    }
  }

  return undefined;
}

/**
 * Find the position of a particular spell on the field.
 *
 * @category Field
 * @category Spell
 * @param opts.spellId the spell ID to search for
 * @returns {{ x: number; y: number } | undefined}
 */
export function findSpellPositionOnField(opts: {
  spellId: string;
}): { x: number; y: number } | undefined {
  const { spellId } = opts;
  const { field } = combatState();

  for (const [y, row] of field.entries()) {
    for (const [x, node] of row.entries()) {
      if (node.containedSpell?.castId === spellId) {
        return { x, y };
      }
    }
  }

  return undefined;
}

/**
 * Get a specific space on the field.
 *
 * @category Field
 * @param opts.x the x position of the space
 * @param opts.y the y position of the space
 * @returns {FieldNode | undefined}
 */
export function getSpaceFromField(opts: {
  x: number;
  y: number;
}): FieldNode | undefined {
  const { field } = combatState();
  const { x, y } = opts;

  return field[y]?.[x];
}

/**
 * Check if a specific space on the field is empty.
 *
 * @category Field
 * @param opts.x the x position of the space
 * @param opts.y the y position of the space
 * @returns {boolean}
 */
export function isFieldSpaceEmpty(opts: { x: number; y: number }): boolean {
  const { x, y } = opts;

  const node = getSpaceFromField({ x, y });
  if (!node) return false;

  return !node.containedSpell && !node.containedElement;
}

/**
 * Get a list of targetable spaces for a spell, based on the pattern of the spell.
 *
 * @category Field
 * @category Spell
 * @param opts.spell the spell to check
 * @param opts.x the x position of the spell
 * @param opts.y the y position of the spell
 * @returns {Record<number, Record<number, Spell>>}
 */
export function getTargettableSpacesForSpellAroundPosition(opts: {
  spell: Spell;
  x: number;
  y: number;
}): Record<number, Record<number, Spell>> {
  const { spell, x, y } = opts;
  const { width, height } = combatState();

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
    const canPlaceHere = canPlaceSpellOnTile({ spell, x: tile.x, y: tile.y });
    if (!canPlaceHere) return;

    setInTargetField(tile.x, tile.y);
  });

  return targetField as Record<number, Record<number, Spell>>;
}

/**
 * Remove a spell from the field. This will stop it from interacting with the game.
 *
 * @category Field
 * @category Spell
 * @param opts.spellId the spell ID to remove
 * @param opts.fullRemoval if true, the spell will also be removed from the action queue.
 */
export function removeSpellFromField(opts: {
  spellId: string;
  fullRemoval: boolean;
}): void {
  const { spellId, fullRemoval } = opts;
  const { field } = combatState();

  const fieldSpell = findSpellOnField({ spellId });
  if (!fieldSpell) return;

  if (fullRemoval) {
    removeSpellFromQueue({ spellId });

    callRitualGlobalFunction({
      func: 'onSpellRemoved',
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

/**
 * Move a spell to a particular position. This will handle all collision and movement logic.
 *
 * @category Field
 * @category Spell
 * @param opts.spell the spell to move
 * @param opts.currentX the current x position of the spell
 * @param opts.currentY the current y position of the spell
 * @param opts.nextX the next x position of the spell
 * @param opts.nextY the next y position of the spell
 * @param opts.disallowEntryIntoNextTile if true, the spell will not be allowed to move into the next tile
 */
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
  const { field, players } = combatState();

  // get our current tile
  const currentTile = getSpaceFromField({ x: currentX, y: currentY });
  if (!currentTile) return;

  const removeMovingSpellFromField = (fullRemoval: boolean) => {
    if (currentTile.containedSpell?.castId !== spell.castId) return;

    removeSpellFromField({ spellId: spell.castId, fullRemoval });
  };

  // check if we have a next tile
  const nextTile = getSpaceFromField({ x: nextX, y: nextY });
  if (!nextTile) return;

  if (nextY === 0 || nextY === field.length - 1) {
    const opponentRef =
      spell.caster === CombatTurnOrder.Player
        ? players[CombatTurnOrder.Opponent]
        : players[CombatTurnOrder.Player];

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

    spellCollisionDamageReduction({
      collider: spell,
      collidee: containedSpell,
    });

    if (isSpellDead({ spell })) {
      shouldMoveToNextTile = false;
    }

    // if, on the off chance, a new spell is placed here, we don't allow movement
    // we don't want weird conditions to arise
    if (nextTile.containedSpell) {
      shouldMoveToNextTile = false;
    }

    getAllElementalCollisionImpls().forEach((collision) => {
      if (!collision.hasCollisionReaction(collisionArgs)) return;

      collision.collide(collisionArgs);

      if (collision.collisionWinner(collisionArgs) !== spell) {
        shouldMoveToNextTile = false;
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

/**
 * Move a spell exactly one step forward. Most spells utilize this to move.
 *
 * @category Field
 * @category Spell
 * @param opts.spell the spell to move
 */
export function moveSpellForwardOneStep(opts: { spell: FieldSpell }): void {
  const { spell } = opts;

  const position = findSpellPositionOnField({ spellId: spell.castId });
  if (!position) return;

  const yDelta = spell.caster === CombatTurnOrder.Player ? -1 : 1;
  const nextY = position.y + yDelta;
  const nextX = position.x;

  const validTiles = [{ nextX, nextY }];

  const possibleNewTiles = callRitualGlobalFunction({
    func: 'onSpellPickMovementTiles',
    funcOpts: { spell, x: position.x, y: position.y, validTiles },
  }) as RitualPickableTile[][];

  const tileList: RitualPickableTile[] = randomChoice(
    possibleNewTiles ?? [validTiles],
  );
  const validNextTiles = tileList.filter((t) =>
    getSpaceFromField({ x: t.nextX, y: t.nextY }),
  );
  const nextTile =
    validNextTiles.length > 0 ? randomChoice(validNextTiles) : validTiles[0];

  moveSpellToPosition({
    spell,
    currentX: position.x,
    currentY: position.y,
    nextX: nextTile.nextX,
    nextY: nextTile.nextY,
  });
}

/**
 * Handle all spell movements. This is called at the end of every turn.
 * This is one of very few `async` functions in the game, as it needs to handle spell movement in a way that doesn't block the game.
 * It doesn't need to be called manually.
 *
 * @category Field
 * @category Spell
 * @internal
 * @returns {Promise<void>}
 */
export async function handleEndOfTurnSpellActions(): Promise<void> {
  const { spellQueue, currentTurn } = combatState();

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
        lowerSpellTimer({ spell });
        return;
      }

      const numSteps = spell.speed;
      if (numSteps <= 0) return;

      await Promise.all(
        [...Array(numSteps)].map(async (_, i) => {
          await delay(75 * i);

          const spell = findSpellOnField({ spellId });
          if (!spell) return;

          moveSpellForwardOneStep({ spell });
        }),
      );
    }),
  ]);

  await delay(200);
}
