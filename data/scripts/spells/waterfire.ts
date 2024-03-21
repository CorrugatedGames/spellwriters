import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

export const waterfire: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextSpellArgs,
  ) {
    const { newPhase, newTurn } = opts;

    const {
      spellContext: {
        spell: { caster, y: spellY, x: spellX },
      },
    } = context;

    if (newPhase !== 'SpellMove') return;
    if (newTurn !== caster) return;

    const myStreamlineSpells = window.api
      .findSpellsOnField()
      .filter(({ y, x, spell }) => {
        if (spell.caster !== caster) return;
        if (!window.api.isSpellElement({ spell, element: 'water' })) return;

        return y === spellY && (x === spellX + 1 || x === spellX - 1);
      });

    myStreamlineSpells.forEach(({ spell }) => {
      window.api.increaseSpellTagByKey({
        spell,
        tag: 'streamline',
        value: 1,
      });
    });
  },
};
