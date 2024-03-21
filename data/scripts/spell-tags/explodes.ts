import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellCollisionSpaceArgs,
} from '../../../typings/interfaces';

export const explodes: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellCollision: (
    opts: RitualSpellCollisionSpaceArgs,
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
        x,
        y,
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

    window.api.increaseSpellTagByKey({
      spell,
      tag: 'explodes',
      value: -1,
    });

    hitNearbyTile(collisionX - 1, collisionY);
    hitNearbyTile(collisionX + 1, collisionY);
  },
};
