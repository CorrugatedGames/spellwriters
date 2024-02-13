import {
  type RitualCurrentContextRelicArgs,
  type RitualDefaultArgs,
  type RitualImpl,
} from '../../../typings/interfaces';

export const gemofgreed: RitualImpl = {
  ...window.api.defaultRitual(),

  onCombatStart: (
    opts: RitualDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    window.api.drawCard(owner);
    window.api.drawCard(owner);
  },
};
