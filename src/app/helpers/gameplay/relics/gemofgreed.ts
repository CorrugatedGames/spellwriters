import {
  type RitualCurrentContextRelicArgs,
  type RitualDefaultArgs,
  type RitualImpl,
} from '../../../interfaces';
import { defaultRitual } from '../defaults/ritual';
import { drawCard } from '../turn';

export const gemofgreed: RitualImpl = {
  ...defaultRitual(),

  onCombatStart: (
    opts: RitualDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    drawCard(owner);
    drawCard(owner);
  },
};
