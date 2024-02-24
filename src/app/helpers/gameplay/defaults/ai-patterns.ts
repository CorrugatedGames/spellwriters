import { type AIPatternImpl, type ContentItem } from '../../../interfaces';

/**
 * The default AI pattern.
 *
 * @category AI
 * @category Content Item
 */
export const plainAIPattern: AIPatternImpl & ContentItem = {
  __contentType: 'AIPattern',
  canMakeDecision: () => false,
  makeDecision: () => {},
};

/**
 * The default AI pattern.
 *
 * @category AI
 * @category Content Item
 *
 * @returns The default AI pattern.
 */
export const defaultAIPattern: () => AIPatternImpl = () => ({
  ...plainAIPattern,
});
