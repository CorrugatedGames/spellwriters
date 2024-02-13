import { type AIPatternImpl } from '../../../interfaces';

export const plainAIPattern: AIPatternImpl = {
  canMakeDecision: () => false,
  makeDecision: () => {},
};

export const defaultAIPattern: () => AIPatternImpl = () => ({
  ...plainAIPattern,
});
