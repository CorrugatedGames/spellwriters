import {
  RitualCurrentContextRelicArgs,
  RitualDefaultArgs,
  RitualImpl,
} from '../../../interfaces';
import { allElements } from '../../lookup/elements';
import { randomChoice } from '../../static/rng';
import { defaultRitual } from '../defaults/ritual';
import {
  elementKeyToFieldElement,
  getTargettableFieldSpaces,
  setFieldElement,
} from '../field';

export const elementalgoo: RitualImpl = {
  ...defaultRitual(),

  onCombatStart: (
    opts: RitualDefaultArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    const validElements = allElements().filter(
      (element) =>
        element.interactions.length > 0 && element.createdBy.length > 0,
    );
    let validSpaces = getTargettableFieldSpaces();

    for (let i = 0; i < 3; i++) {
      const randomElement = randomChoice(validElements);
      const randomSpace = randomChoice(validSpaces);

      setFieldElement({
        x: randomSpace.x,
        y: randomSpace.y,

        element: elementKeyToFieldElement({
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
