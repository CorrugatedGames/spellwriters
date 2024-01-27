import { FieldSpell } from '../../interfaces';
import { removeSpellFromField } from './field';

export function isSpellDead(opts: { spell: FieldSpell }): boolean {
  const { spell } = opts;

  return spell.damage === 0;
}

export function setSpellDamage(opts: {
  spell: FieldSpell;
  power: number;
}): void {
  const { spell, power } = opts;

  spell.damage = Math.max(0, power);

  if (spell.damage === 0) {
    removeSpellFromField(spell.castId);
  }
}

export function defaultCollisionWinner(opts: {
  collider: FieldSpell;
  collidee: FieldSpell;
}): FieldSpell | undefined {
  const { collider, collidee } = opts;

  if (collidee.castTime > 0) return collider;

  if (collider.damage > collidee.damage) {
    return collider;
  }

  if (collider.damage < collidee.damage) {
    return collidee;
  }

  return undefined;
}

export function defaultShouldFieldEffectBeCreated(opts: {
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
}
