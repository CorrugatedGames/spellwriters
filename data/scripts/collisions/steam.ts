import type {
  CollideOpts,
  CollisionWinnerOpts,
  ElementalCollisionImpl,
  FieldSpell,
  HasCollisionReactionOpts,
  OnSpellEnterOpts,
  OnSpellExitOpts,
} from '../../../typings/interfaces';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [
    window.api.getElementKey(collider.element),
    window.api.getElementKey(collidee.element),
  ];
  return elements.includes('fire') && elements.includes('water');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee, collisionX, collisionY } = opts;

  if (!window.api.defaultShouldFieldElementBeCreated({ collider, collidee }))
    return;

  window.api.setFieldElement({
    x: collisionX,
    y: collisionY,
    element: window.api.elementKeyToFieldElement({
      elementKey: 'steam',
      caster: collider.caster,
    }),
  });
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  return window.api.defaultCollisionWinner(opts);
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;

  if (window.api.isSpellElement({ spell, element: 'fire' })) {
    window.api.clearFieldElement({ ...currentTile });
  }

  if (window.api.isSpellElement({ spell, element: 'earth' })) {
    window.api.setFieldElement({
      ...currentTile,
      element: window.api.elementKeyToFieldElement({
        elementKey: 'mud',
        caster: spell.caster,
      }),
    });
  }

  if (window.api.isSpellElement({ spell, element: 'electric' })) {
    window.api.setSpellDamage({ spell, damage: spell.damage + 1 });
    window.api.setFieldElement({
      ...currentTile,
      element: window.api.elementKeyToFieldElement({
        elementKey: 'chargedsteam',
        caster: spell.caster,
      }),
    });
  }
}

function onSpellExit(opts: OnSpellExitOpts): void {
  const { nextTile, spell } = opts;

  if (window.api.isSpellElement({ spell, element: 'water' })) {
    window.api.setFieldElement({
      ...nextTile,
      element: window.api.elementKeyToFieldElement({
        elementKey: 'steam',
        caster: spell.caster,
      }),
    });
  }
}

export const steam: ElementalCollisionImpl = {
  ...window.api.defaultElementalCollision(),
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
