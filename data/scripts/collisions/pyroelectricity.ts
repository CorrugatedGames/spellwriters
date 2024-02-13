import type {
  CollideOpts,
  CollisionWinnerOpts,
  ElementalCollisionImpl,
  FieldSpell,
  HasCollisionReactionOpts,
} from '../../../typings/interfaces';

function hasCollisionReaction(opts: HasCollisionReactionOpts): boolean {
  const { collider, collidee } = opts;
  const elements = [
    window.api.getElementKey(collider.element),
    window.api.getElementKey(collidee.element),
  ];

  return elements.includes('fire') && elements.includes('electric');
}

function collide(opts: CollideOpts): void {
  const { collider, collidee, collisionX, collisionY } = opts;
  if (!window.api.defaultShouldFieldElementBeCreated({ collider, collidee }))
    return;

  const hitNearbyTile = (x: number, y: number): void => {
    const spellInst = window.api.getSpellByName('Electric Explosion');
    if (!spellInst) return;

    const elementRef = window.api.getElementByKey('fire');
    if (!elementRef) return;

    const fieldSpellInst = window.api.spellToFieldSpell({
      spell: {
        ...spellInst,
        element: elementRef.id,
      },
      caster: collider.caster,
    });

    window.api.moveSpellToPosition({
      spell: fieldSpellInst,
      currentX: collisionX,
      currentY: collisionY,
      nextX: x,
      nextY: y,
      disallowEntryIntoNextTile: true,
    });
  };

  hitNearbyTile(collisionX - 1, collisionY);
  hitNearbyTile(collisionX + 1, collisionY);
}

function collisionWinner(opts: CollisionWinnerOpts): FieldSpell | undefined {
  const { collider, collidee } = opts;
  const colliderElement = window.api.getElementKey(collider.element);
  const collideeElement = window.api.getElementKey(collidee.element);

  if (colliderElement === 'electric' && collideeElement === 'electric')
    return undefined;

  if (collideeElement === 'electric') return collider;
  if (colliderElement === 'electric') return collidee;

  return undefined;
}

export const pyroelectricity: ElementalCollisionImpl = {
  ...window.api.defaultElementalCollision(),
  hasCollisionReaction,
  collide,
  collisionWinner,
};
