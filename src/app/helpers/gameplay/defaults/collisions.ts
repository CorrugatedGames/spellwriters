import {
  type ContentItem,
  type ElementalCollisionImpl,
} from '../../../interfaces';

export const plainElementalCollision: ElementalCollisionImpl & ContentItem = {
  __contentType: 'ElementalCollision',
  collide: () => {},
  collisionWinner: () => undefined,
  hasCollisionReaction: () => false,
  onSpellEnter: () => {},
  onSpellExit: () => {},
};

export const defaultElementalCollision: () => ElementalCollisionImpl = () => ({
  ...plainElementalCollision,
});
