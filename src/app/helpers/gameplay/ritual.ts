import {
  type ActivePlayer,
  type FieldSpell,
  type RitualCurrentContextRelicArgs,
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellDefaultArgs,
} from '../../interfaces';
import { getRelicImpl, getRelicKey } from '../lookup/relics';
import { getSpellTagImpl } from '../lookup/spell-tags';
import { getSpellImpl } from '../lookup/spells';
import { freeze } from '../static/object';
import { findSpellOnField } from './field';
import { gamestate } from './signal';
import { getSpellTags } from './spell';

function isTF(t: boolean | undefined): boolean {
  return t === true || t === false;
}

function getAllFieldSpells(): FieldSpell[] {
  return gamestate()
    .spellQueue.map((spellId) => findSpellOnField({ spellId }))
    .filter(Boolean) as FieldSpell[];
}

function getAllRelics(): Array<{
  id: string;
  key: string | undefined;
  stacks: number;
  owner: ActivePlayer;
}> {
  return gamestate().players.flatMap((player) =>
    Object.keys(player.relics ?? {}).map((relicId) => ({
      id: relicId,
      key: getRelicKey(relicId),
      stacks: player.relics[relicId],
      owner: player,
    })),
  );
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

export function callRitualGlobalFunction<T extends keyof RitualImpl>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
}): undefined | boolean[] {
  const { func, funcOpts } = opts;

  const allSpells = getAllFieldSpells();
  const allRelics = getAllRelics();

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
  ].flat(Infinity) as boolean[];

  const returnValsTF = returnVals.filter(isTF);
  return returnValsTF.length > 0 ? returnValsTF : undefined;
}

export function callRitualSpellFunction<T extends keyof RitualImpl>(opts: {
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

export function callRitualRelicFunction<T extends keyof RitualImpl>(opts: {
  func: T;
  funcOpts: Parameters<RitualImpl[T]>[0];
  context: RitualCurrentContextRelicArgs;
}): undefined | boolean {
  const { func, funcOpts, context } = opts;

  const relicImpl = getRelicImpl(context.relicContext.id);
  return relicImpl?.[func]?.(funcOpts as never, context) ? true : undefined;
}
