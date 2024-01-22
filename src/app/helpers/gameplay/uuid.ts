import { v4 as uuid } from 'uuid';

export function getId(): string {
  return uuid();
}
