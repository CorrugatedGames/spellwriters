import type { Spritable } from './sprite';

export interface StatusEffect extends Spritable {
  name: string;
  key: string;
  id: string;
  description: string;
}
