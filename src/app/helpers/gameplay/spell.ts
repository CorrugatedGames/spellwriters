import { FieldSpell, SpellStatImpl, SpellTagImpl } from '../../interfaces';
import { getElementKey } from '../lookup/elements';
import { getSpellTagImpl } from '../lookup/spell-tags';
import { findSpellOnField, removeSpellFromField } from './field';
import { gamestate } from './signal';

export function isSpellDead(opts: { spell: FieldSpell }): boolean {
  const { spell } = opts;

  return spell.damage === 0;
}

export function isSpellElement(opts: {
  spell: FieldSpell;
  element: string;
}): boolean {
  const { spell, element } = opts;

  return getElementKey(spell.element) === element;
}

export function setSpellStat<T extends SpellStatImpl>(opts: {
  spell: FieldSpell;
  stat: keyof Pick<FieldSpell, T>;
  value: FieldSpell[T];
}): void {
  const { spell, stat, value } = opts;

  const oldValue = spell[stat];

  spell[stat] = value;

  callSpellTagFunction({
    spell,
    func: 'onStatChange',
    funcOpts: { spell, stat, oldValue, newValue: value },
  });
}

export function setSpellDamage(opts: {
  spell: FieldSpell;
  power: number;
}): void {
  const { spell, power } = opts;

  setSpellStat({
    spell,
    stat: SpellStatImpl.Damage,
    value: Math.max(0, power),
  });

  if (spell.damage === 0) {
    removeSpellFromField({ spellId: spell.castId });
  }
}

export function setSpellTag(opts: {
  spell: FieldSpell;
  tag: string;
  value: number;
}): void {
  const { spell, tag, value } = opts;

  callSpellTagFunction({
    spell,
    func: 'onTagChange',
    funcOpts: { spell, tag, newValue: value },
  });

  if (value <= 0) {
    delete spell.tags[tag];
    return;
  }

  spell.tags[tag] = Math.floor(value);
}

export function getSpellTags(opts: {
  spell: FieldSpell;
}): Array<{ key: string; value: number }> {
  const { spell } = opts;

  return Object.keys(spell.tags ?? {}).map((key) => ({
    key,
    value: spell.tags[key],
  }));
}

export function callSpellTagFunctionGlobally<
  T extends keyof SpellTagImpl,
>(opts: {
  func: T;
  funcOpts: Omit<Parameters<SpellTagImpl[T]>[0], 'spell'>;
}): void {
  const { func, funcOpts } = opts;

  const allSpells = gamestate()
    .spellQueue.map((spellId) => findSpellOnField({ spellId }))
    .filter(Boolean) as FieldSpell[];
  allSpells.forEach((spell) => {
    const spellOpts: Parameters<SpellTagImpl[T]>[0] = {
      ...funcOpts,
      spell,
    } as Parameters<SpellTagImpl[T]>[0];
    callSpellTagFunction({ spell, func, funcOpts: spellOpts });
  });
}

export function callSpellTagFunction<T extends keyof SpellTagImpl>(opts: {
  spell: FieldSpell;
  func: T;
  funcOpts: Parameters<SpellTagImpl[T]>[0];
}): void | boolean[] {
  const { spell, func, funcOpts } = opts;
  const allTags = getSpellTags({ spell });

  switch (func) {
    case 'onSpaceEnter':
    case 'onSpaceExit':
      return allTags.map((tag) =>
        getSpellTagImpl(tag.key)?.[func]?.(funcOpts as never),
      ) as boolean[];

    default:
      allTags.forEach((tag) =>
        getSpellTagImpl(tag.key)?.[func]?.(funcOpts as never),
      );
      return;
  }
}

export function defaultCollisionWinner(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): FieldSpell | undefined {
  const { collider, collidee } = opts;

  if (collidee.castTime > 0 || collider.damage > collidee.damage) {
    callSpellTagFunction({
      spell: collider,
      func: 'onCollisionWin',
      funcOpts: { spell: collider, collidedWith: collidee },
    });

    callSpellTagFunction({
      spell: collidee,
      func: 'onCollisionLose',
      funcOpts: { spell: collidee, collidedWith: collider },
    });

    return collider;
  }

  if (collider.damage < collidee.damage) {
    callSpellTagFunction({
      spell: collidee,
      func: 'onCollisionWin',
      funcOpts: { spell: collidee, collidedWith: collider },
    });

    callSpellTagFunction({
      spell: collider,
      func: 'onCollisionLose',
      funcOpts: { spell: collider, collidedWith: collidee },
    });
    return collidee;
  }

  callSpellTagFunction({
    spell: collider,
    func: 'onCollisionTie',
    funcOpts: { spell: collider, collidedWith: collidee },
  });

  callSpellTagFunction({
    spell: collidee,
    func: 'onCollisionTie',
    funcOpts: { spell: collidee, collidedWith: collider },
  });

  return undefined;
}

export function defaultShouldFieldElementBeCreated(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): boolean {
  const { collider, collidee } = opts;
  return collider.castTime <= 0 && collidee.castTime <= 0;
}

export function defaultCollisionDamageReduction(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): void {
  const { collider, collidee } = opts;

  const colliderDamage = collider.castTime > 0 ? 0 : collider.damage;
  const collideeDamage = collidee.castTime > 0 ? 0 : collidee.damage;

  setSpellDamage({ spell: collider, power: colliderDamage - collideeDamage });
  setSpellDamage({ spell: collidee, power: collideeDamage - colliderDamage });

  if (collider.damage === 0) {
    if (collider.castTime > 0) {
      callSpellTagFunction({
        spell: collidee,
        func: 'onSpellCancel',
        funcOpts: { spell: collidee, canceledSpell: collider },
      });

      callSpellTagFunction({
        spell: collider,
        func: 'onSpellCanceled',
        funcOpts: { spell: collider, canceledBySpell: collidee },
      });
    } else {
      callSpellTagFunction({
        spell: collidee,
        func: 'onSpellDestroy',
        funcOpts: { spell: collidee, destroyedSpell: collider },
      });

      callSpellTagFunction({
        spell: collider,
        func: 'onSpellDestroyed',
        funcOpts: { spell: collider, destroyedBySpell: collidee },
      });
    }
  }

  if (collidee.damage === 0) {
    if (collidee.castTime > 0) {
      callSpellTagFunction({
        spell: collider,
        func: 'onSpellCancel',
        funcOpts: { spell: collider, canceledSpell: collidee },
      });

      callSpellTagFunction({
        spell: collidee,
        func: 'onSpellCanceled',
        funcOpts: { spell: collidee, canceledBySpell: collider },
      });
    } else {
      callSpellTagFunction({
        spell: collider,
        func: 'onSpellDestroy',
        funcOpts: { spell: collider, destroyedSpell: collidee },
      });

      callSpellTagFunction({
        spell: collidee,
        func: 'onSpellDestroyed',
        funcOpts: { spell: collidee, destroyedBySpell: collider },
      });
    }
  }
}
