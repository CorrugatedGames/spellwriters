import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const muddy: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellSpaceExited: (
    opts: RitualSpellTagSpaceArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;

    const { x, y } = opts;
    const {
      spellContext: { spell },
    } = context;

    window.api.setFieldElement({
      x,
      y,
      element: window.api.elementKeyToFieldElement({
        elementKey: 'mud',
        caster: spell.caster,
      }),
    });

    const muddyDuration = window.api.getSpellTagValueByKey({
      spell,
      tag: 'muddy',
    });

    window.api.setSpellTagByKey({
      spell,
      tag: 'muddy',
      value: Math.max(0, muddyDuration - 1),
    });
  },
};
