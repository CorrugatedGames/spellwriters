import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const oily: RitualImpl = {
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
        elementKey: 'oil',
        caster: spell.caster,
      }),
    });

    const tag = window.api.getSpellTagByKey('oily')?.id;
    if (!tag) return;

    const oilyDuration = spell.tags[tag] ?? 1;
    window.api.setSpellTag({
      spell,
      tag,
      value: Math.max(0, oilyDuration - 1),
    });
  },
};
