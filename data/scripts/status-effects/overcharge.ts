import {
  SpellStatImpl,
  type RitualCurrentContextStatusEffectArgs,
  type RitualImpl,
  type RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const overcharge: RitualImpl = {
  ...window.api.defaultRitualStatusEffect(),

  onSpellPlaced(
    opts: RitualSpellTagSpaceArgs,
    context: RitualCurrentContextStatusEffectArgs,
  ) {
    if (!context) return;
    const {
      statusEffectContext: { owner },
    } = context;

    const { spell } = opts;

    if (!window.api.isSpellOwnedBy({ spell, owner })) return;
    if (!window.api.isSpellElement({ spell, element: 'electric' })) return;

    const stacks = window.api.statusEffectStacks(owner, 'overcharge');
    if (stacks < 3) return;

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: spell.damage + 2,
    });

    window.api.removeStatusEffectFromPlayer(owner, 'overcharge', 3);
  },
};
