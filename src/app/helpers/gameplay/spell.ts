import { FieldSpell } from '../../interfaces';

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
