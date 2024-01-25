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
} from '../spell';

function hasCollisionReaction(
  collider: FieldSpell,
  collidee: FieldSpell,
): boolean {
  const elements = [collider.element, collidee.element];
  return (
    elements.includes(SpellElement.Earth) &&
    elements.includes(SpellElement.Water)
  );
}

function collide(
  gamestate: GameState,
  collider: FieldSpell,
  collidee: FieldSpell,
): void {
  if (!defaultShouldFieldEffectBeCreated(collider, collidee)) return;

  const { x, y } = findSpellPositionOnField(collidee.castId)!;
  setFieldEffect(gamestate.field, x, y, SpellEffect.Mud);
}

function collisionWinner(
  collider: FieldSpell,
  collidee: FieldSpell,
): FieldSpell | undefined {
  return defaultCollisionWinner(collider, collidee);
}

function onSpellEnter(gamestate: GameState, spell: FieldSpell): void {
  console.log('mud enter', { spell });
}

function onSpellExit(gamestate: GameState, spell: FieldSpell): void {
  console.log('mud exit', { spell });
}

export const mud: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
