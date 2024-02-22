import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellTagSpaceArgs,
} from '../../../typings/interfaces';

export const steamy: RitualImpl = {
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
        elementKey: 'steam',
        caster: spell.caster,
      }),
    });

    const tag = window.api.getSpellTagByKey('steamy')?.id;
    if (!tag) return;

    const steamyDuration = spell.tags[tag] ?? 1;
    window.api.setSpellTag({
      spell,
      tag,
      value: Math.max(0, steamyDuration - 1),
    });
  },
};
