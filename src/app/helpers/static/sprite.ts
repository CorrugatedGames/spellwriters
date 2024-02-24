import { signal, type WritableSignal } from '@angular/core';

/**
 * @internal
 */
export const spriteIterationCount: WritableSignal<number> = signal(0);
