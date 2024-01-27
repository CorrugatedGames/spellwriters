import {
  ElementalCollision,
  FieldSpell,
  GameState,
  SpellEffect,
  SpellElement,
} from '../../../interfaces';
import { findSpellPositionOnField, setFieldEffect } from '../field';
import {
  defaultCollisionWinner,
  defaultShouldFieldEffectBeCreated,
  setSpellDamage,
} from '../spell';

function hasCollisionReaction(
  collider: FieldSpell,
  collidee: FieldSpell,
): boolean {
  const elements = [collider.element, collidee.element];
  return (
    elements.includes(SpellElement.Fire) &&
    elements.includes(SpellElement.Earth)
  );
}

function collide(
  gamestate: GameState,
  collider: FieldSpell,
  collidee: FieldSpell,
): void {
  if (!defaultShouldFieldEffectBeCreated(collider, collidee)) return;

  const pos = findSpellPositionOnField(collidee.castId);
  if (!pos) return;

  const { x, y } = pos;
  setFieldEffect(x, y, SpellEffect.Oil);
}

function collisionWinner(
  collider: FieldSpell,
  collidee: FieldSpell,
): FieldSpell | undefined {
  return defaultCollisionWinner(collider, collidee);
}

function onSpellEnter(
  gamestate: GameState,
  previousTile: { x: number; y: number },
  currentTile: { x: number; y: number },
  spell: FieldSpell,
): void {
  if (spell.element === SpellElement.Earth) {
    setFieldEffect(currentTile.x, currentTile.y, undefined);
  }

  if (spell.element === SpellElement.Fire) {
    setSpellDamage(spell, spell.damage + 1);
    setFieldEffect(currentTile.x, currentTile.y, SpellEffect.BurningOil);
  }

  if (spell.element === SpellElement.Electric) {
    setFieldEffect(currentTile.x, currentTile.y, SpellEffect.BurningOil);
  }
}

function onSpellExit(
  gamestate: GameState,
  currentTile: { x: number; y: number },
  nextTile: { x: number; y: number },
  spell: FieldSpell,
): void {
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
