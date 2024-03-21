import type {
  ElementalCollisionImpl,
  OnSpellEnterOpts,
} from '../../../typings/interfaces';

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (window.api.isSpellElement({ spell, element: 'earth' })) {
    window.api.clearFieldElement({ ...currentTile });
  }

  if (window.api.isSpellElement({ spell, element: 'water' })) {
    window.api.setFieldElement({
      ...currentTile,
      element: window.api.elementKeyToFieldElement({
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });
  }

  if (window.api.isSpellElement({ spell, element: 'fire' })) {
    window.api.setSpellDamage({ spell, damage: spell.damage + 1 });
  }
}

export const burningoil: ElementalCollisionImpl = {
  ...window.api.defaultElementalCollision(),
  onSpellEnter,
};
