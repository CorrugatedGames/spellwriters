import {
  type RitualCurrentContextStatusEffectArgs,
  type RitualImpl,
  type RitualSpellSpaceArgs,
} from '../../../typings/interfaces';

export const overcharge: RitualImpl = {
  ...window.api.defaultRitualStatusEffect(),

  onSpellPlaced(
    opts: RitualSpellSpaceArgs,
    context: RitualCurrentContextStatusEffectArgs,
  ) {
    if (!context) return;
    const {
      statusEffectContext: { owner },
    } = context;

    const { spell } = opts;

    if (spell.instant) return;
    if (!window.api.isSpellOwnedBy({ spell, owner })) return;
    if (!window.api.isSpellElement({ spell, element: 'electric' })) return;

    const stacks = window.api.statusEffectStacks({
      player: owner,
      statusEffectKey: 'overcharge',
    });
    if (stacks < 3) return;

    window.api.setSpellDamage({
      spell,
      damage: spell.damage + 2,
    });

    window.api.removeStatusEffectFromPlayer({
      player: owner,
      statusEffectKey: 'overcharge',
      value: 3,
    });
  },
};
