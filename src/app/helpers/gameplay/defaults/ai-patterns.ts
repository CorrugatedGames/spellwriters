import { type AIPatternImpl, type ContentItem } from '../../../interfaces';

export const plainAIPattern: AIPatternImpl & ContentItem = {
  __contentType: 'AIPattern',
  canMakeDecision: () => false,
  makeDecision: () => {},
};

export const defaultAIPattern: () => AIPatternImpl = () => ({
  ...plainAIPattern,
});
