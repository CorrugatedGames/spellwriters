import type {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellDestroyedArgs,
} from '../../../typings/interfaces';

export const earthencape: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onSpellDestroyed(
    opts: RitualSpellDestroyedArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    const {
      relicContext: { stacks, owner },
    } = context;
    const { spell } = opts;
    if (!window.api.isSpellOwnedBy({ spell: opts.spell, owner })) return;

    const isStationary = window.api.getSpellTagValueByKey({
      spell,
      tag: 'stationary',
    });
    if (!isStationary) return;

    window.api.gainHealth({
      character: owner,
      amount: stacks,
    });
  },
};
