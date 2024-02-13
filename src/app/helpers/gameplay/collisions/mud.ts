import {
  type CollideOpts,
  type CollisionWinnerOpts,
  type ElementalCollision,
  type FieldSpell,
  type HasCollisionReactionOpts,
  type OnSpellEnterOpts,
  type OnSpellExitOpts,
} from '../../../interfaces';
import { getElementKey } from '../../lookup/elements';
import { defaultElementalCollision } from '../defaults/collisions';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import {
  defaultCollisionWinner,
  defaultShouldFieldElementBeCreated,
  isSpellElement,
  setSpellDamage,
} from '../spell';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [
    getElementKey(collider.element),
    getElementKey(collidee.element),
  ];
  return elements.includes('earth') && elements.includes('water');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee, collisionX, collisionY } = opts;
  if (!defaultShouldFieldElementBeCreated({ collider, collidee })) return;

  setFieldElement({
    x: collisionX,
    y: collisionY,
    element: elementKeyToFieldElement({
      elementKey: 'mud',
      caster: collider.caster,
    }),
  });
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  return defaultCollisionWinner(opts);
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (isSpellElement({ spell, element: 'earth' })) {
    setFieldElement({ ...currentTile, element: undefined });
  }

  if (isSpellElement({ spell, element: 'fire' })) {
    setFieldElement({
      ...currentTile,
      element: elementKeyToFieldElement({
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });
  }

  if (isSpellElement({ spell, element: 'water' })) {
    setSpellDamage({ spell, power: spell.damage + 1 });
  }

  if (isSpellElement({ spell, element: 'electric' })) {
    setSpellDamage({ spell, power: spell.damage - 1 });
  }
}

function onSpellExit(opts: OnSpellExitOpts): void {
  const { nextTile, spell } = opts;
  if (isSpellElement({ spell, element: 'water' })) {
    setFieldElement({
      ...nextTile,
      element: elementKeyToFieldElement({
        elementKey: 'mud',
        caster: spell.caster,
      }),
    });
  }
}

export const mud: ElementalCollision = {
  ...defaultElementalCollision(),
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
