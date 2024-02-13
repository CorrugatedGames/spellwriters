import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type SpellTagCollisionArgs,
} from '../../../typings/interfaces';

export const explodes: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellCollision: (
    opts: SpellTagCollisionArgs & { collisionX: number; collisionY: number },
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const { collisionX, collisionY } = opts;
    const {
      spellContext: { spell },
    } = context;

    const hitNearbyTile = (x: number, y: number): void => {
      const spellInst = window.api.getSpellByName('Electric Explosion');
      if (!spellInst) return;

      const fieldSpellInst = window.api.spellToFieldSpell({
        spell: {
          ...spellInst,
          element: spell.element,
        },
        caster: spell.caster,
      });

      window.api.moveSpellToPosition({
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
