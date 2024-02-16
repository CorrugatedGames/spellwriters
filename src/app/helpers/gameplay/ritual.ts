import {
  type FieldSpell,
  type RitualCurrentContextRelicArgs,
  type RitualCurrentContextSpellArgs,
  type RitualCurrentContextTileArgs,
  type RitualImpl,
  type RitualSpellDefaultArgs,
} from '../../interfaces';
import { getRelicImpl, getRelicKey } from '../lookup/relics';
import { getSpellTagImpl } from '../lookup/spell-tags';
import { getSpellImpl } from '../lookup/spells';
import { getTileStatusImpl } from '../lookup/tile-status';
import { freeze } from '../static/object';
import { findSpellOnField } from './field';
import { gamestate } from './gamestate';
import { getSpellTags } from './spell';

function isTF(t: boolean | undefined): boolean {
  return t === true || t === false;
}

function getAllFieldSpells(): FieldSpell[] {
  return gamestate()
    .spellQueue.map((spellId) => findSpellOnField({ spellId }))
    .filter(Boolean) as FieldSpell[];
}

function getAllRelics(): RitualCurrentContextRelicArgs['relicContext'][] {
  return gamestate().players.flatMap((player) =>
    Object.keys(player.relics ?? {}).map((relicId) => ({
      id: relicId,
      key: getRelicKey(relicId),
      stacks: player.relics[relicId],
      owner: player,
    })),
  );
}

function getAllTileStatuses(): RitualCurrentContextTileArgs['tileContext'][] {
  return gamestate()
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

export function isCurrentSpellContextSpell(opts: {
  funcOpts: RitualSpellDefaultArgs;
  context: RitualCurrentContextSpellArgs;
}): boolean {
  const { funcOpts, context } = opts;
  return funcOpts.spell.castId === context.spellContext.spell.castId;
}

export function isCurrentSpellOwnedByRelicOwner(opts: {
  spell: FieldSpell;
  context: RitualCurrentContextRelicArgs;
}): boolean {
  const { spell, context } = opts;
  return spell.caster === context.relicContext.owner.turnOrder;
}

type RitualImplGeneric = keyof RitualImpl;

export function callRitualGlobalFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
}): undefined | boolean[] {
  const { func, funcOpts } = opts;

  const allSpells = getAllFieldSpells();
  const allRelics = getAllRelics();
  const allTiles = getAllTileStatuses();

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
  ].flat(Infinity) as boolean[];

  const returnValsTF = returnVals.filter(isTF);
  return returnValsTF.length > 0 ? returnValsTF : undefined;
}

export function callRitualSpellFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextSpellArgs;
}): undefined | boolean[] {
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
    .flat(Infinity)
    .filter(Boolean) as boolean[];

  const returnValsTF = returnVals.filter(isTF);
  return returnValsTF.length > 0 ? returnValsTF : undefined;
}

export function callRitualRelicFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextRelicArgs;
}): undefined | boolean {
  const { func, funcOpts, context } = opts;

  const relicImpl = getRelicImpl(context.relicContext.id);
  return relicImpl?.[func]?.(funcOpts as never, context) ?? undefined;
}

export function callRitualTileFunction<T extends RitualImplGeneric>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextTileArgs;
}): undefined | boolean {
  const { func, funcOpts, context } = opts;

  const tileStatusImpl = getTileStatusImpl(context.tileContext.id);
  return tileStatusImpl?.[func]?.(funcOpts as never, context) ?? undefined;
}
