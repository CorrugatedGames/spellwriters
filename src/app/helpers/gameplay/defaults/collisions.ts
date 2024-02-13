import { type ElementalCollision } from '../../../interfaces';

export const plainElementalCollision: ElementalCollision = {
  collide: () => {},
  collisionWinner: () => undefined,
  hasCollisionReaction: () => false,
  onSpellEnter: () => {},
  onSpellExit: () => {},
};

export const defaultElementalCollision: () => ElementalCollision = () => ({
  ...plainElementalCollision,
});
