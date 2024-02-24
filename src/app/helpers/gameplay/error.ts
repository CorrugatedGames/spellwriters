import { signal, type WritableSignal } from '@angular/core';
import { timer, type Subscription } from 'rxjs';

let existingTimer: Subscription | undefined;

/**
 * @internal
 */
export const ingameErrorMessage: WritableSignal<string> = signal('');

/**
 * Set an ingame error message, which shows up as a red banner near the bottom of the screen.
 *
 * @category Error
 * @param opts.message - The message to set.
 */
export function setIngameErrorMessage(opts: { message: string }): void {
  const { message } = opts;

  ingameErrorMessage.set(message);

  existingTimer?.unsubscribe();

  existingTimer = timer(3000).subscribe(() => {
    ingameErrorMessage.set('');
  });
}
