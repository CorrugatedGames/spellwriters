import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellSpaceArgs,
} from '../../../typings/interfaces';

export const steamy: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellSpaceExited: (
    opts: RitualSpellSpaceArgs,
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

    window.api.increaseSpellTagByKey({
      spell,
      tag: 'steamy',
      value: -1,
    });
  },
};
