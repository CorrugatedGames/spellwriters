export interface SpellPattern {
  name: string;
  id: string;
  key: string;
}

export interface SpellPatternImpl {
  chooseTargetableTiles(opts: {
    allTargettableNodes: Array<{ x: number; y: number }>;
  }): Array<{ x: number; y: number }>;

  getFieldNodesBasedOnTarget(opts: {
    x: number;
    y: number;
  }): Array<{ x: number; y: number }>;
}
