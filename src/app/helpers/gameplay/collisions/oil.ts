import {
  CollideOpts,
  CollisionWinnerOpts,
  ElementalCollision,
  FieldSpell,
  HasCollisionReactionOpts,
  OnSpellEnterOpts,
  OnSpellExitOpts,
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
    elements.includes(SpellElement.Earth)
  );
}

function collide(opts: CollideOpts): void {
  const { collider, collidee } = opts;
  if (!defaultShouldFieldEffectBeCreated({ collider, collidee })) return;

  const pos = findSpellPositionOnField(collidee.castId);
  if (!pos) return;

  const { x, y } = pos;
  setFieldEffect(x, y, SpellEffect.Oil);
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  return defaultCollisionWinner({ collider, collidee });
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (spell.element === SpellElement.Earth) {
    setFieldEffect(currentTile.x, currentTile.y, undefined);
  }

  if (spell.element === SpellElement.Fire) {
    setSpellDamage({ spell, power: spell.damage + 1 });
    setFieldEffect(currentTile.x, currentTile.y, SpellEffect.BurningOil);
  }

  if (spell.element === SpellElement.Electric) {
    setFieldEffect(currentTile.x, currentTile.y, SpellEffect.BurningOil);
  }
}

function onSpellExit(opts: OnSpellExitOpts): void {
  const { nextTile, spell } = opts;
  if (spell.element === SpellElement.Water) {
    setFieldEffect(nextTile.x, nextTile.y, SpellEffect.Oil);
  }
}

export const oil: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
