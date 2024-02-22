import {
  type RitualCurrentContextRelicArgs,
  type RitualDefaultArgs,
  type RitualImpl,
} from '../../../typings/interfaces';

export const gemofgreed: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onCombatStart: (
    opts: RitualDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    window.api.drawCard({ character: owner });
    window.api.drawCard({ character: owner });
  },
};
