import { type FieldSpell, type SpellStatType } from '../../interfaces';
import { getElementKey } from '../lookup/elements';
import { getSpellTagByKey, getSpellTagKey } from '../lookup/spell-tags';
import { freeze } from '../static/object';
import { removeSpellFromField } from './field';
import { setFieldSpell } from './field-spell';
import { combatstate } from './gamestate';
import { callRitualGlobalFunction, callRitualSpellFunction } from './ritual';

/**
 * Add a spell at a certain position on the field.
 *
 * @category Spell
 * @param opts.spell the spell to add
 * @param opts.x the x position to add the spell at
 * @param opts.y the y position to add the spell at
 */
export function addSpellAtPosition(opts: {
  spell: FieldSpell;
  x: number;
  y: number;
}): void {
  const { spell, x, y } = opts;

  addSpellToQueue({ spell });
  setFieldSpell({ x, y, spell });
}

/**
 * @internal
 */
export function addSpellToQueue(opts: { spell: FieldSpell }): void {
  const { spell } = opts;
  const { spellQueue } = combatstate();

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
export function setSpellStat(opts: {
  spell: FieldSpell;
  stat: SpellStatType;
  value: number;
}): void {
  const { spell, stat, value } = opts;

  const oldValue = spell[stat];
  const newValue = Math.floor(value);

  spell[stat] = Math.max(0, newValue);

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
 * @param opts.damage the power to set the damage to
 */
export function setSpellDamage(opts: {
  spell: FieldSpell;
  damage: number;
}): void {
  const { spell, damage } = opts;

  setSpellStat({
    spell,
    stat: 'damage',
    value: Math.max(0, damage),
  });

  if (spell.damage === 0) {
    removeSpellFromField({ spellId: spell.castId, fullRemoval: true });
  }
}

/**
 * Set the speed of a spell
 *
 * @category Spell
 * @param opts.spell the spell to set the damage for
 * @param opts.power the power to set the damage to
 */
export function setSpellSpeed(opts: {
  spell: FieldSpell;
  speed: number;
}): void {
  const { spell, speed } = opts;

  setSpellStat({
    spell,
    stat: 'speed',
    value: Math.max(0, speed),
  });
}

/**
 * Get the value of a spell tag for a given spell.
 *
 * @category Spell
 * @param opts.spell the spell to get the tag from
 * @param opts.tag the tag to get the value for
 * @returns the value of the tag for the spell
 */
export function getSpellTagValueByKey(opts: {
  spell: FieldSpell;
  tag: string;
}): number {
  const { spell, tag } = opts;

  const tagId = getSpellTagByKey(tag)?.id;
  if (!tagId) return 0;

  return spell.tags[tagId] ?? 0;
}

/**
 * Set the spell tag value for a spell.
 *
 * @internal
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
 * Increase the spell tag value for a spell by a specified amount.
 *
 * @internal
 * @category Spell
 * @param opts.spell the spell to increase the tag for
 * @param opts.tag the tag to increase
 * @param opts.value the value to increase the tag by
 */
export function increaseSpellTagByKey(opts: {
  spell: FieldSpell;
  tag: string;
  value: number;
}): void {
  const { spell, tag, value } = opts;

  const currentValue = getSpellTagValueByKey({ spell, tag });
  setSpellTagByKey({ spell, tag, value: Math.max(0, currentValue + value) });
}

/**
 * Set the spell tag value for a spell (by the tag key).
 *
 * @category Spell
 * @param opts.spell the spell to set the tag for
 * @param opts.tag the tag to set
 * @param opts.value the value to set the tag to
 */
export function setSpellTagByKey(opts: {
  spell: FieldSpell;
  tag: string;
  value: number;
}): void {
  const { spell, tag, value } = opts;

  const tagId = getSpellTagByKey(tag)?.id;
  if (!tagId) return;

  setSpellTag({ spell, tag: tagId, value });
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
 * @category Spell
 * @param opts.collider the spell that is colliding
 * @param opts.collidee the spell that is being collided with
 */
export function spellCollisionDamageReduction(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): void {
  const { collider, collidee } = opts;

  const colliderDamage = collider.castTime > 0 ? 0 : collider.damage;
  const collideeDamage = collidee.castTime > 0 ? 0 : collidee.damage;

  setSpellDamage({ spell: collider, damage: colliderDamage - collideeDamage });
  setSpellDamage({ spell: collidee, damage: collideeDamage - colliderDamage });

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

      // call for the canceled spell since it's removed
      if (isSpellDead({ spell: collider })) {
        callRitualSpellFunction({
          func: 'onSpellCanceled',
          funcOpts: { spell: collider, canceledBySpell: collidee },
          context: { spellContext: freeze({ spell: collider }) },
        });
      }
    } else {
      callRitualGlobalFunction({
        func: 'onSpellDestroy',
        funcOpts: { spell: collidee, destroyedSpell: collider },
      });

      callRitualGlobalFunction({
        func: 'onSpellDestroyed',
        funcOpts: { spell: collider, destroyedBySpell: collidee },
      });

      // call for the destroyed spell since it's removed
      if (isSpellDead({ spell: collider })) {
        callRitualSpellFunction({
          func: 'onSpellDestroyed',
          funcOpts: { spell: collider, destroyedBySpell: collidee },
          context: { spellContext: freeze({ spell: collider }) },
        });
      }
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

      // call for the canceled spell since it's removed
      if (isSpellDead({ spell: collider })) {
        callRitualSpellFunction({
          func: 'onSpellCanceled',
          funcOpts: { spell: collidee, canceledBySpell: collider },
          context: { spellContext: freeze({ spell: collidee }) },
        });
      }
    } else {
      callRitualGlobalFunction({
        func: 'onSpellDestroy',
        funcOpts: { spell: collider, destroyedSpell: collidee },
      });

      callRitualGlobalFunction({
        func: 'onSpellDestroyed',
        funcOpts: { spell: collidee, destroyedBySpell: collider },
      });

      // call for the destroyed spell since it's removed
      if (isSpellDead({ spell: collider })) {
        callRitualSpellFunction({
          func: 'onSpellDestroyed',
          funcOpts: { spell: collidee, destroyedBySpell: collider },
          context: { spellContext: freeze({ spell: collidee }) },
        });
      }
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
  const { spellQueue } = combatstate();

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
    stat: 'castTime',
    value: Math.max(0, spell.castTime - 1),
  });
}
