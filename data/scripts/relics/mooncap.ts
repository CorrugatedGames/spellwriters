import type {
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualPhaseChangeArgs,
} from '../../../typings/interfaces';

export const mooncap: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    const { newPhase, newTurn } = opts;

    const {
      relicContext: { owner },
    } = context;

    if (newPhase !== 'SpellMove') return;
    if (newTurn !== owner.turnOrder) return;

    const myStreamlineSpells = window.api
      .findSpellsOnField()
      .filter(({ y, spell }) => {
        if (spell.caster !== owner.turnOrder) return;
        if (!window.api.isSpellElement({ spell, element: 'water' })) return;

        const spellsInY = window.api
          .findSpellsOnField()
          .filter(({ y: y2, spell: spell2 }) => {
            if (!window.api.isSpellElement({ spell: spell2, element: 'water' }))
              return false;
            return spell !== spell2 && y === y2;
          });
        return spellsInY.length > 0;
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
