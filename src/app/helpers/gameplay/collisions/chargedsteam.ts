import {
  CollideOpts,
  CollisionWinnerOpts,
  ElementalCollision,
  FieldSpell,
  HasCollisionReactionOpts,
  OnSpellEnterOpts,
  SpellEffect,
  SpellElement,
} from '../../../interfaces';
import { findSpellPositionOnField, setFieldEffect } from '../field';
import {
  defaultCollisionWinner,
  defaultShouldFieldEffectBeCreated,
  setSpellDamage,
} from '../spell';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [collider.element, collidee.element];
  return (
    elements.includes(SpellElement.Fire) &&
    elements.includes(SpellElement.Water)
  );
}

function collide(opts: CollideOpts): void {
  const { collider, collidee } = opts;
  if (!defaultShouldFieldEffectBeCreated({ collider, collidee })) return;

  const pos = findSpellPositionOnField({ spellId: collidee.castId });
  if (!pos) return;

  setFieldEffect({ ...pos, effect: SpellEffect.Steam });
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  return defaultCollisionWinner({ collider, collidee });
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (spell.element === SpellElement.Fire) {
    setFieldEffect({ ...currentTile, effect: undefined });
  }

  if (spell.element === SpellElement.Electric) {
    setSpellDamage({ spell, power: spell.damage + 1 });
  }

  if (spell.element === SpellElement.Earth) {
    setFieldEffect({ ...currentTile, effect: SpellEffect.Mud });
  }

  if (spell.element === SpellElement.Water) {
    setFieldEffect({ ...currentTile, effect: undefined });

    spell.element = SpellElement.Electric;
    setSpellDamage({ spell, power: spell.damage + 1 });
  }
}

function onSpellExit(): void {}

export const chargedsteam: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
