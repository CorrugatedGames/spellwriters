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
import {
  elementKeyToFieldElement,
  findSpellPositionOnField,
  setFieldElement,
} from '../field';
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
  return elements.includes('fire') && elements.includes('earth');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee } = opts;
  if (!defaultShouldFieldEffectBeCreated({ collider, collidee })) return;

  const pos = findSpellPositionOnField({ spellId: collidee.castId });
  if (!pos) return;

  setFieldElement({
    ...pos,
    element: elementKeyToFieldElement({
      elementKey: 'oil',
      caster: collider.caster,
    }),
  });
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  return defaultCollisionWinner({ collider, collidee });
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (isSpellElement({ spell, element: 'earth' })) {
    setFieldElement({ ...currentTile, element: undefined });
  }

  if (isSpellElement({ spell, element: 'fire' })) {
    setSpellDamage({ spell, power: spell.damage + 1 });
    setFieldElement({
      ...currentTile,
      element: elementKeyToFieldElement({
        elementKey: 'burningoil',
        caster: spell.caster,
      }),
    });
  }

  if (isSpellElement({ spell, element: 'electric' })) {
    setFieldElement({
      ...currentTile,
      element: elementKeyToFieldElement({
        elementKey: 'burningoil',
        caster: spell.caster,
      }),
    });
  }
}

function onSpellExit(opts: OnSpellExitOpts): void {
  const { nextTile, spell } = opts;
  if (isSpellElement({ spell, element: 'water' })) {
    setFieldElement({
      ...nextTile,
      element: elementKeyToFieldElement({
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });
  }
}

export const oil: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
