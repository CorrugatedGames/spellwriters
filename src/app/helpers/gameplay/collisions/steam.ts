import {
  CollideOpts,
  CollisionWinnerOpts,
  ElementalCollision,
  FieldSpell,
  HasCollisionReactionOpts,
  OnSpellEnterOpts,
  OnSpellExitOpts,
} from '../../../interfaces';
import { getElementKey } from '../../lookup/elements';
import { findSpellPositionOnField, setFieldElement } from '../field';
import {
  defaultCollisionWinner,
  defaultShouldFieldEffectBeCreated,
  isSpellElement,
  setSpellDamage,
} from '../spell';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [
    getElementKey(collider.element),
    getElementKey(collidee.element),
  ];
  return elements.includes('fire') && elements.includes('water');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee } = opts;

  if (!defaultShouldFieldEffectBeCreated({ collider, collidee })) return;

  const pos = findSpellPositionOnField({ spellId: collidee.castId });
  if (!pos) return;

  setFieldElement({ ...pos, element: 'steam' });
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  return defaultCollisionWinner({ collider, collidee });
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;

  if (isSpellElement({ spell, element: 'fire' })) {
    setFieldElement({ ...currentTile, element: undefined });
  }

  if (isSpellElement({ spell, element: 'earth' })) {
    setFieldElement({ ...currentTile, element: 'mud' });
  }

  if (isSpellElement({ spell, element: 'electric' })) {
    setSpellDamage({ spell, power: spell.damage + 1 });
    setFieldElement({ ...currentTile, element: 'chargedsteam' });
  }
}

function onSpellExit(opts: OnSpellExitOpts): void {
  const { nextTile, spell } = opts;

  if (isSpellElement({ spell, element: 'water' })) {
    setFieldElement({ ...nextTile, element: 'steam' });
  }
}

export const steam: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
