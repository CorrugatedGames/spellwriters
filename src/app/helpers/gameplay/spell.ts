import { FieldSpell } from '../../interfaces';
import { removeSpellFromField } from './field';

export function defaultCollisionWinner(
  collider: FieldSpell,
  collidee: FieldSpell,
): FieldSpell | undefined {
  if (collidee.castTime > 0) return collider;

  if (collider.damage > collidee.damage) {
    return collider;
  }

  if (collider.damage < collidee.damage) {
    return collidee;
  }

  return undefined;
}

export function defaultShouldFieldEffectBeCreated(
  collider: FieldSpell,
  collidee: FieldSpell,
): boolean {
  return collider.castTime <= 0 && collidee.castTime <= 0;
}

export function defaultCollisionDamageReduction(
  collider: FieldSpell,
  collidee: FieldSpell,
): void {
  const colliderDamage = collider.castTime > 0 ? 0 : collider.damage;
  const collideeDamage = collidee.castTime > 0 ? 0 : collidee.damage;

  collider.damage = Math.max(0, colliderDamage - collideeDamage);
  collidee.damage = Math.max(0, collideeDamage - colliderDamage);
}

export function defaultCollisionSpellRemoval(
  collider: FieldSpell,
  collidee: FieldSpell,
): void {
  if (collider.damage === 0) {
    removeSpellFromField(collider.castId);
  }

  if (collidee.damage === 0) {
    removeSpellFromField(collidee.castId);
  }
}
