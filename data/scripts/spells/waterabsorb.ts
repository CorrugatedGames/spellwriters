import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellCollisionSpaceArgs,
  type RitualSpellStatChangeArgs,
} from '../../../typings/interfaces';

export const waterabsorb: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellCollision(
    opts: RitualSpellCollisionSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    const me = context.spellContext.spell;
    const { collidedWith } = opts;

    if (me !== opts.spell) return;
    if (!window.api.isSpellElement({ spell: collidedWith, element: 'water' }))
      return;

    window.api.setSpellDamage({
      spell: me,
      damage: me.damage + collidedWith.damage * 2,
    });
  },

  onSpellStatChange(
    opts: RitualSpellStatChangeArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    if (context.spellContext.spell !== opts.spell) return;

    const { stat, newValue } = opts;
    if (stat !== 'speed' || newValue === 1) return;

    window.api.setSpellSpeed({
      spell: context.spellContext.spell,
      speed: 1,
    });
  },
};
