import { type WritableSignal, signal } from '@angular/core';
import { type Subscription, timer } from 'rxjs';

let existingTimer: Subscription | undefined;

export const ingameErrorMessage: WritableSignal<string> = signal('');

export function setIngameErrorMessage(opts: { message: string }): void {
  const { message } = opts;

  ingameErrorMessage.set(message);

  existingTimer?.unsubscribe();

  existingTimer = timer(3000).subscribe(() => {
    ingameErrorMessage.set('');
  });
}
