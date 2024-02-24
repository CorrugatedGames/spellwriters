import { SpellStatImpl, type FieldSpell } from '../../interfaces';
import { getElementKey } from '../lookup/elements';
import { getSpellTagKey } from '../lookup/spell-tags';
import { removeSpellFromField } from './field';
import { gamestate } from './gamestate';
import { callRitualGlobalFunction } from './ritual';

/**
 * @internal
 */
export function addSpellToQueue(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { spellQueue } = gamestate();

  spellQueue.push(spell.castId);
}

/**
 * Check whether or not a spell is dead (Damage = 0).
 *
 * @category Spell
 * @param opts.spell the spell to check
 * @returns true if the spell is dead, false otherwise
 */
export function isSpellDead(opts: { spell: FieldSpell }): boolean {
  const { spell } = opts;

  return spell.damage === 0;
}

/**
 * Check whether or not a spell is a specific element.
 *
 * @category Spell
 * @param opts.spell the spell to check
 * @param opts.element the element to check against
 * @returns true if the spell is the specified element, false otherwise
 */
export function isSpellElement(opts: {
  spell: FieldSpell;
  element: string;
}): boolean {
  const { spell, element } = opts;

  return getElementKey(spell.element) === element;
}

/**
 * Set a stat value for a spell.
 *
 * @category Spell
 * @param opts.spell the spell to set stats for
 * @param opts.stat the stat to set
 * @param opts.value the value to set the stat to
 */
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

/**
 * Set the damage of a spell. Useful wrapper for `setSpellStat` because it also removes the spell if the damage is 0.
 *
 * @category Spell
 * @param opts.spell the spell to set the damage for
 * @param opts.power the power to set the damage to
 */
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

/**
 * Set the spell tag value for a spell.
 *
 * @category Spell
 * @param opts.spell the spell to set the tag for
 * @param opts.tag the tag to set
 * @param opts.value the value to set the tag to
 */
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

/**
 * Get the tags for a spell.
 *
 * @category Spell
 * @param opts.spell the spell to get the tags for
 * @returns an array of tags for the spell
 */
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

/**
 * The default collision winner function. This function is used to determine which spell wins in a collision.
 * It is used by most custom element collision functions.
 *
 * @category Elemental Collision
 * @param opts.collider the spell that is colliding
 * @param opts.collidee the spell that is being collided with
 * @returns the winning spell, or undefined if there is a tie
 */
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

/**
 * The default function that determines if a field element should be created.
 * This function is used by most custom element collision functions.
 * This function checks if the collider has a cast time <= 0 (it's moving) and if the collidee has a cast time <= 0 (it's moving).
 *
 * @category Elemental Collision
 * @param opts.collider the spell that is colliding
 * @param opts.collidee the spell that is being collided with
 * @returns true if a field element should be created, false otherwise
 */
export function defaultShouldFieldElementBeCreated(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): boolean {
  const { collider, collidee } = opts;
  return collider.castTime <= 0 && collidee.castTime <= 0;
}

/**
 * The default function that determines how damage reduction is done for an elemental collision.
 * This function is used by most custom element collision functions.
 * This function reduces the damage of the collider by the damage of the collidee, and the damage of the collidee by the damage of the collider.
 * If the damage of a spell is 0, it will be removed from the field.
 *
 * @category Elemental Collision
 * @param opts.collider the spell that is colliding
 * @param opts.collidee the spell that is being collided with
 */
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

/**
 * Remove a spell from the cast queue if it exists. This will stop it from interacting with the game.
 * This is primarily used when the spell is dead.
 *
 * @category Spell
 * @param opts.spellId the spell ID to remove
 */
export function removeSpellFromQueue(opts: { spellId: string }): void {
  const { spellId } = opts;
  const { spellQueue } = gamestate();

  const index = spellQueue.indexOf(spellId);
  if (index !== -1) {
    spellQueue.splice(index, 1);
  }
}

/**
 * Lower the cast timer for a spell.
 *
 * @category Spell
 * @param opts.spell the spell to lower the timer of
 */
export function lowerSpellTimer(opts: { spell: FieldSpell }): void {
  const { spell } = opts;

  setSpellStat({
    spell,
    stat: SpellStatImpl.CastTime,
    value: Math.max(0, spell.castTime - 1),
  });
}
