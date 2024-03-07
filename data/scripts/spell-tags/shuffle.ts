import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellTagSpaceArgs,
  SpellStatImpl,
} from '../../../typings/interfaces';

export const shuffle: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellPlaced: (
    opts: RitualSpellTagSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const {
      spellContext: { spell },
    } = context;

    const tag = window.api.getSpellTagByKey('shuffle')?.id;
    if (!tag) return;

    const shuffleValue = spell.tags[tag] ?? 1;

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
      stat: 'speed' as SpellStatImpl,
      value: chosenSetValue.speed,
    });

    window.api.setSpellStat({
      spell,
      stat: 'damage' as SpellStatImpl,
      value: chosenSetValue.damage,
    });
  },
};
