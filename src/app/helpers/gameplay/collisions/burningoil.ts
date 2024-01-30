import {
  ElementalCollision,
  FieldSpell,
  OnSpellEnterOpts,
} from '../../../interfaces';
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

function onSpellExit(): void {}

export const burningoil: ElementalCollision = {
  hasCollisionReaction,
  collide,
  collisionWinner,
  onSpellEnter,
  onSpellExit,
};
