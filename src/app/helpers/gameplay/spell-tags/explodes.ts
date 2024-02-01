import { SpellTagCollisionArgs, SpellTagImpl } from '../../../interfaces';
import { getSpellByName } from '../../lookup/spells';
import { defaultSpellTag } from '../defaults/spell-tags';
import { moveSpellToPosition, spellToFieldSpell } from '../field';

export const explodes: SpellTagImpl = {
  ...defaultSpellTag,

  onCollision: (
    opts: SpellTagCollisionArgs & { collisionX: number; collisionY: number },
  ) => {
    const { spell, collisionX, collisionY } = opts;

    const hitNearbyTile = (x: number, y: number): void => {
      const spellInst = getSpellByName('Electric Explosion');
      if (!spellInst) return;

      const fieldSpellInst = spellToFieldSpell({
        spell: {
          ...spellInst,
          element: spell.element,
        },
        caster: spell.caster,
      });

      moveSpellToPosition({
        spell: fieldSpellInst,
        currentX: collisionX,
        currentY: collisionY,
        nextX: x,
        nextY: y,
        disallowEntryIntoNextTile: true,
      });
    };

    hitNearbyTile(collisionX - 1, collisionY);
    hitNearbyTile(collisionX + 1, collisionY);
  },
};
