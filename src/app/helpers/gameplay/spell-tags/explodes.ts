import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type SpellTagCollisionArgs,
} from '../../../interfaces';
import { getSpellByName } from '../../lookup/spells';
import { defaultRitual } from '../defaults/ritual';
import { moveSpellToPosition, spellToFieldSpell } from '../field';
import { isCurrentSpellContextSpell } from '../ritual';

export const explodes: RitualImpl = {
  ...defaultRitual(),

  onSpellCollision: (
    opts: SpellTagCollisionArgs & { collisionX: number; collisionY: number },
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!isCurrentSpellContextSpell({ funcOpts: opts, context })) return;

    const { collisionX, collisionY } = opts;
    const {
      spellContext: { spell },
    } = context;

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
