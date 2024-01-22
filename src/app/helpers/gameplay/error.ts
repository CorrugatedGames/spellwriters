import { WritableSignal, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';

let existingTimer: Subscription | undefined;

export const ingameErrorMessage: WritableSignal<string> = signal('');

export function setIngameErrorMessage(message: string): void {
  ingameErrorMessage.set(message);

  existingTimer?.unsubscribe();

  existingTimer = timer(3000).subscribe(() => {
    ingameErrorMessage.set('');
  });
}
