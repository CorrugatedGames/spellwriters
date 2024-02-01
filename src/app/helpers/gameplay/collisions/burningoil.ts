import { ElementalCollision, OnSpellEnterOpts } from '../../../interfaces';
import { defaultElementalCollision } from '../defaults/collisions';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { isSpellElement, setSpellDamage } from '../spell';

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (isSpellElement({ spell, element: 'earth' })) {
    setFieldElement({ ...currentTile, element: undefined });
  }

  if (isSpellElement({ spell, element: 'water' })) {
    setFieldElement({
      ...currentTile,
      element: elementKeyToFieldElement({
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });
  }

  if (isSpellElement({ spell, element: 'fire' })) {
    setSpellDamage({ spell, power: spell.damage + 1 });
  }
}

export const burningoil: ElementalCollision = {
  ...defaultElementalCollision,
  onSpellEnter,
};
