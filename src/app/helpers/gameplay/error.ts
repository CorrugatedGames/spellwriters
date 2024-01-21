import { WritableSignal, signal } from '@angular/core';
import { timer } from 'rxjs';

export const ingameErrorMessage: WritableSignal<string> = signal('');

export function setIngameErrorMessage(message: string) {
  ingameErrorMessage.set(message);

  timer(3000).subscribe(() => {
    ingameErrorMessage.set('');
  });
}
