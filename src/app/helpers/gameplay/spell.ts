import { FieldSpell } from '../../interfaces';
import { removeSpellFromField } from './field';

export function isSpellDead(spell: FieldSpell): boolean {
  return spell.damage === 0;
}

export function setSpellDamage(spell: FieldSpell, power: number): void {
  spell.damage = Math.max(0, power);

  if (spell.damage === 0) {
    removeSpellFromField(spell.castId);
  }
}

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

  setSpellDamage(collider, colliderDamage - collideeDamage);
  setSpellDamage(collidee, collideeDamage - colliderDamage);

  console.log({ collidee, collider, collideeDamage, colliderDamage });
}
