import {
  type CombatActivePlayer,
  type FieldSpell,
  type RitualCurrentContextRelicArgs,
  type RitualCurrentContextSpellArgs,
  type RitualCurrentContextStatusEffectArgs,
  type RitualCurrentContextTileArgs,
  type RitualImpl,
  type RitualPickableTile,
  type RitualReturn,
  type RitualReturnMulti,
  type RitualSpellDefaultArgs,
  type RitualSpellTagSpacePlacementArgs,
} from '../../interfaces';
import { getRelicImpl, getRelicKey } from '../lookup/relics';
import { getSpellTagImpl } from '../lookup/spell-tags';
import { getSpellImpl } from '../lookup/spells';
import {
  getStatusEffectImpl,
  getStatusEffectKey,
} from '../lookup/status-effect';
import { getTileStatusImpl } from '../lookup/tile-status';
import { freeze } from '../static/object';
import { combatState } from './combatstate';
import { findSpellOnField } from './field';
import { getSpellTags } from './spell';

function isTF(t: boolean | undefined): boolean {
  return t === true || t === false;
}

function hasArrSize(t: unknown[]): boolean {
  return t?.length > 0;
}
function isPickableTile(
  t: RitualPickableTile | undefined,
): t is RitualPickableTile {
  if (!t) return false;

  return t.nextX >= 0 && t.nextY >= 0;
}

function hasNestedPickableTile(tiles: RitualPickableTile[][]): boolean {
  return tiles?.some((subTiles) => subTiles?.some((t) => isPickableTile(t)));
}

function getAllFieldSpells(): FieldSpell[] {
  return combatState()
    .spellQueue.map((spellId) => findSpellOnField({ spellId }))
    .filter(Boolean) as FieldSpell[];
}

function getAllRelics(): RitualCurrentContextRelicArgs['relicContext'][] {
  return combatState().players.flatMap((player) =>
    Object.keys(player.relics ?? {}).map((relicId) => ({
      id: relicId,
      key: getRelicKey(relicId),
      stacks: player.relics[relicId],
      owner: player,
    })),
  );
}

function getAllStatusEffects(): RitualCurrentContextStatusEffectArgs['statusEffectContext'][] {
  return combatState().players.flatMap((player) =>
    Object.keys(player.statusEffects ?? {}).map((statusEffectId) => ({
      id: statusEffectId,
      key: getStatusEffectKey(statusEffectId),
      stacks: player.statusEffects[statusEffectId],
      owner: player,
    })),
  );
}

function getAllTileStatuses(): RitualCurrentContextTileArgs['tileContext'][] {
  return combatState()
    .field.flatMap((row, y) =>
      row.map((tile, x) => {
        const status = tile.containedStatus;
        if (!status) return undefined;

        return {
          id: status.id,
          key: status.key,
          tileStatus: status,
          x,
          y,
        };
      }),
    )
    .filter(Boolean) as RitualCurrentContextTileArgs['tileContext'][];
}

/**
 * Check if the current spell is the spell mentioned in the context.
 * Used by Rituals to determine if a spell is the one being referred to.
 *
 * @category Ritual
 * @param opts.funcOpts The default arguments for the Ritual function.
 * @param opts.context The context to check against.
 * @returns true if the `castId` of the current spell matches the `castId` of the context spell.
 */
export function isCurrentSpellContextSpell(opts: {
  funcOpts: RitualSpellDefaultArgs;
  context: RitualCurrentContextSpellArgs;
}): boolean {
  const { funcOpts, context } = opts;
  return funcOpts.spell.castId === context.spellContext.spell.castId;
}

/**
 * Check if the current invocation is the first invocation of a spell placement.
 * Ordinarily, a spell will call a function for each space it is placed on.
 * This function will return true if it is the first invocation of the spell.
 *
 * @category Ritual
 * @param opts.funcOpts The funcOpts for spell placement.
 * @returns true if this is the first placement of the spell
 */
export function isFirstInvocationOfPlacedSpell(opts: {
  funcOpts: RitualSpellTagSpacePlacementArgs;
}): boolean {
  const { funcOpts } = opts;
  return funcOpts.placeNum === 0;
}

/**
 * Check if the given player is the current turn.
 *
 * @category Ritual
 * @param opts.player The player to check.
 * @returns true if the player is the current turn.
 */
export function isCurrentTurn(opts: { player: CombatActivePlayer }): boolean {
  const { player } = opts;
  const state = combatState();
  return state.currentTurn === player.turnOrder;
}

/**
 * Check if the given player owns a spell.
 *
 * @category Ritual
 * @param opts.spell The spell to check.
 * @param opts.player The player to check.
 * @returns true if the player owns the spell.
 */
export function isSpellOwnedBy(opts: {
  spell: FieldSpell;
  owner: CombatActivePlayer;
}): boolean {
  const { spell, owner } = opts;
  return spell.caster === owner.turnOrder;
}

/**
 * @internal
 */
type RitualImplGeneric = keyof RitualImpl;

export function callRitualSpellFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextSpellArgs;
}): RitualReturnMulti {
  const { func, funcOpts, context } = opts;
  const spell = context.spellContext.spell;
  const allTags = getSpellTags({ spell });

  const returnVals = [
    getSpellImpl(spell.id)?.[func]?.(funcOpts as never, context),

    allTags.map((tag) =>
      getSpellTagImpl(tag.id)?.[func]?.(funcOpts as never, {
        ...freeze(context),
        spellTagContext: freeze(tag),
      }),
    ),
  ]
    .flat(1)
    .filter(Boolean) as boolean[] | RitualPickableTile[][];

  if (isTF(returnVals[0] as boolean)) {
    const returnValsTF = (returnVals as boolean[]).filter(isTF);
    return returnValsTF.length > 0 ? returnValsTF : undefined;
  }

  const nestedPickables = returnVals as RitualPickableTile[][];
  if (hasNestedPickableTile(nestedPickables)) {
    return nestedPickables;
  }
}

export function callRitualRelicFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextRelicArgs;
}): RitualReturn {
  const { func, funcOpts, context } = opts;

  const relicImpl = getRelicImpl(context.relicContext.id);
  return relicImpl?.[func]?.(funcOpts as never, context) ?? undefined;
}

export function callRitualStatusEffectFunction<
  T extends RitualImplGeneric,
>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextStatusEffectArgs;
}): RitualReturn {
  const { func, funcOpts, context } = opts;

  const statusEffectImpl = getStatusEffectImpl(context.statusEffectContext.id);
  return statusEffectImpl?.[func]?.(funcOpts as never, context) ?? undefined;
}

export function callRitualTileFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextTileArgs;
}): RitualReturn {
  const { func, funcOpts, context } = opts;

  const tileStatusImpl = getTileStatusImpl(context.tileContext.id);
  return tileStatusImpl?.[func]?.(funcOpts as never, context) ?? undefined;
}

/**
 * Call a Ritual function on all spells, relics, tiles, and status effects.
 *
 * @category Ritual
 * @param opts.func The function to call. Is type checked to ensure it exists.
 * @param opts.funcOpts The default arguments for the Ritual function. Type checked to ensure they match the function.
 * @returns whatever the Ritual function returns. If it returns a boolean, it will return an array of booleans. If it returns undefined, it will return undefined.
 */
export function callRitualGlobalFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
}): RitualReturnMulti {
  const { func, funcOpts } = opts;

  const allSpells = getAllFieldSpells();
  const allRelics = getAllRelics();
  const allTiles = getAllTileStatuses();
  const allStatusEffects = getAllStatusEffects();

  const returnVals = [
    allRelics.map((relic) =>
      callRitualRelicFunction({
        func,
        funcOpts,
        context: { relicContext: freeze(relic) },
      }),
    ),
    allSpells.map((spell) =>
      callRitualSpellFunction({
        func,
        funcOpts,
        context: { spellContext: freeze({ spell }) },
      }),
    ),
    allTiles.map((tile) =>
      callRitualTileFunction({
        func,
        funcOpts,
        context: { tileContext: freeze(tile) },
      }),
    ),
    allStatusEffects.map((statusEffect) =>
      callRitualStatusEffectFunction({
        func,
        funcOpts,
        context: { statusEffectContext: freeze(statusEffect) },
      }),
    ),
  ].flat(1) as boolean[] | RitualPickableTile[][][];

  if (isTF(returnVals[0] as boolean)) {
    const returnValsTF = (returnVals as boolean[]).filter(isTF);
    return returnValsTF.length > 0 ? returnValsTF : undefined;
  }

  const nestedPickables = returnVals.flat(1) as RitualPickableTile[][];
  if (hasNestedPickableTile(nestedPickables)) {
    return nestedPickables.filter(hasArrSize);
  }
}
