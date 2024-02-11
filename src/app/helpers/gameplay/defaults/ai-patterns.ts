import { type AIPatternImpl } from '../../../interfaces';

export const defaultAIPattern: AIPatternImpl = {
  canMakeDecision: () => false,
  makeDecision: () => {},
};
