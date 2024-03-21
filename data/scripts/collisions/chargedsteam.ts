import type {
  ElementalCollisionImpl,
  OnSpellEnterOpts,
} from '../../../typings/interfaces';

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (window.api.isSpellElement({ spell, element: 'fire' })) {
    window.api.clearFieldElement({ ...currentTile });
  }

  if (window.api.isSpellElement({ spell, element: 'electric' })) {
    window.api.setSpellDamage({ spell, damage: spell.damage + 1 });
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

  if (window.api.isSpellElement({ spell, element: 'water' })) {
    window.api.clearFieldElement({ ...currentTile });

    spell.element = window.api.getElementIdByKey('electric') ?? spell.element;
    window.api.setSpellDamage({ spell, damage: spell.damage + 1 });
  }
}

export const chargedsteam: ElementalCollisionImpl = {
  ...window.api.defaultElementalCollision(),
  onSpellEnter,
};
