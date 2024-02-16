import { SpellStatImpl, type FieldSpell } from '../../interfaces';
import { getElementKey } from '../lookup/elements';
import { getSpellTagKey } from '../lookup/spell-tags';
import { removeSpellFromField } from './field';
import { gamestate } from './gamestate';
import { callRitualGlobalFunction } from './ritual';

export function addSpellToQueue(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { spellQueue } = gamestate();

  spellQueue.push(spell.castId);
}

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
  const newValue: FieldSpell[T] = (
    typeof value === 'number' ? Math.floor(value) : value
  ) as FieldSpell[T];

  spell[stat] = newValue;

  callRitualGlobalFunction({
    func: 'onSpellStatChange',
    funcOpts: { spell, stat, oldValue, newValue },
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
    removeSpellFromField({ spellId: spell.castId, fullRemoval: true });
  }
}

export function setSpellTag(opts: {
  spell: FieldSpell;
  tag: string;
  value: number;
}): void {
  const { spell, tag, value } = opts;

  callRitualGlobalFunction({
    func: 'onSpellTagChange',
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
}): Array<{ id: string; key: string | undefined; stacks: number }> {
  const { spell } = opts;

  return Object.keys(spell.tags ?? {}).map((id) => ({
    id,
    key: getSpellTagKey(id),
    stacks: spell.tags[id],
  }));
}

export function defaultCollisionWinner(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): FieldSpell | undefined {
  const { collider, collidee } = opts;

  if (collidee.castTime > 0 || collider.damage > collidee.damage) {
    callRitualGlobalFunction({
      func: 'onSpellCollisionWin',
      funcOpts: { spell: collider, collidedWith: collidee },
    });

    callRitualGlobalFunction({
      func: 'onSpellCollisionLose',
      funcOpts: { spell: collidee, collidedWith: collider },
    });

    return collider;
  }

  if (collider.damage < collidee.damage) {
    callRitualGlobalFunction({
      func: 'onSpellCollisionWin',
      funcOpts: { spell: collidee, collidedWith: collider },
    });

    callRitualGlobalFunction({
      func: 'onSpellCollisionLose',
      funcOpts: { spell: collider, collidedWith: collidee },
    });
    return collidee;
  }

  callRitualGlobalFunction({
    func: 'onSpellCollisionTie',
    funcOpts: { spell: collider, collidedWith: collidee },
  });

  callRitualGlobalFunction({
    func: 'onSpellCollisionTie',
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
      callRitualGlobalFunction({
        func: 'onSpellCancel',
        funcOpts: { spell: collidee, canceledSpell: collider },
      });

      callRitualGlobalFunction({
        func: 'onSpellCanceled',
        funcOpts: { spell: collider, canceledBySpell: collidee },
      });
    } else {
      callRitualGlobalFunction({
        func: 'onSpellDestroy',
        funcOpts: { spell: collidee, destroyedSpell: collider },
      });

      callRitualGlobalFunction({
        func: 'onSpellDestroyed',
        funcOpts: { spell: collider, destroyedBySpell: collidee },
      });
    }
  }

  if (collidee.damage === 0) {
    if (collidee.castTime > 0) {
      callRitualGlobalFunction({
        func: 'onSpellCancel',
        funcOpts: { spell: collider, canceledSpell: collidee },
      });

      callRitualGlobalFunction({
        func: 'onSpellCanceled',
        funcOpts: { spell: collidee, canceledBySpell: collider },
      });
    } else {
      callRitualGlobalFunction({
        func: 'onSpellDestroy',
        funcOpts: { spell: collider, destroyedSpell: collidee },
      });

      callRitualGlobalFunction({
        func: 'onSpellDestroyed',
        funcOpts: { spell: collidee, destroyedBySpell: collider },
      });
    }
  }
}
