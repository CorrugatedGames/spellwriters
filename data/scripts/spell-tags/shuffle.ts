import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellSpaceArgs,
} from '../../../typings/interfaces';

export const shuffle: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellPlaced: (
    opts: RitualSpellSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    const shuffleValue = window.api.getSpellTagValueByKey({
      spell,
      tag: 'shuffle',
    });

    const allPossibleSetValues = [];
    for (let i = 0; i <= shuffleValue; i++) {
      allPossibleSetValues.push({
        damage: i,
        speed: shuffleValue - i,
      });
    }

    const chosenSetValue = window.api.randomChoice(allPossibleSetValues);

    window.api.setSpellStat({
      spell,
      stat: 'speed',
      value: chosenSetValue.speed,
    });

    window.api.setSpellStat({
      spell,
      stat: 'damage',
      value: chosenSetValue.damage,
    });
  },
};
