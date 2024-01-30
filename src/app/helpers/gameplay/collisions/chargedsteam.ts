import {
  ElementalCollision,
  FieldSpell,
  OnSpellEnterOpts,
} from '../../../interfaces';
import { getElementIdByKey } from '../../lookup/elements';
import { elementKeyToFieldElement, setFieldElement } from '../field';
import { isSpellElement, setSpellDamage } from '../spell';

function hasCollisionReaction(): boolean {
  return false;
}

function collide(): void {}

function collisionWinner(): FieldSpell | undefined {
  return undefined;
}

function onSpellEnter(opts: OnSpellEnterOpts): void {
  const { currentTile, spell } = opts;
  if (isSpellElement({ spell, element: 'fire' })) {
    setFieldElement({ ...currentTile, element: undefined });
  }

  if (isSpellElement({ spell, element: 'electric' })) {
    setSpellDamage({ spell, power: spell.damage + 1 });
  }

  if (isSpellElement({ spell, element: 'earth' })) {
    setFieldElement({
      ...currentTile,
      element: elementKeyToFieldElement({
        elementKey: 'mud',
        caster: spell.caster,
      }),
    });
  }

  if (isSpellElement({ spell, element: 'water' })) {
    setFieldElement({ ...currentTile, element: undefined });

    spell.element = getElementIdByKey('electric') ?? spell.element;
    setSpellDamage({ spell, power: spell.damage + 1 });
  }
}

function onSpellExit(): void {}

export const chargedsteam: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
