export enum FieldEffect {
  Oil = 'oil',
  Mud = 'mud',
  Steam = 'steam',
}

export interface FieldNode {
  containedSpell?: string;
  containedEffect?: FieldEffect;
}

export interface ActivePlayer {
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  hand: string[];
  deck: string[];
}

export interface GameState {
  players: ActivePlayer[];

  width: number;
  height: number;
  field: FieldNode[][];
}
