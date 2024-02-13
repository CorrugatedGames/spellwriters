import type {
  RitualCurrentContextRelicArgs,
  RitualDefaultArgs,
  RitualImpl,
} from '../../../typings/interfaces';

export const elementalgoo: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onCombatStart: (
    opts: RitualDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    const validElements = window.api
      .allElements()
      .filter(
        (element) =>
          element.interactions.length > 0 && element.createdBy.length > 0,
      );
    let validSpaces = window.api.getTargettableFieldSpaces();

    for (let i = 0; i < 3; i++) {
      const randomElement = window.api.randomChoice(validElements);
      const randomSpace = window.api.randomChoice(validSpaces);

      window.api.setFieldElement({
        x: randomSpace.x,
        y: randomSpace.y,

        element: window.api.elementKeyToFieldElement({
          elementKey: randomElement.key,
          caster: owner.turnOrder,
        }),
      });

      validSpaces = validSpaces.filter(
        (space) => space.x !== randomSpace.x && space.y !== randomSpace.y,
      );
    }
  },
};
