import { type WritableSignal, signal } from '@angular/core';

export const phaseBannerString: WritableSignal<string> = signal('');

export function setPhaseBannerString(opts: {
  text: string;
  delay?: number;
}): void {
  const { text } = opts;
  const delay = opts.delay ?? 1000;

  phaseBannerString.set(text);

  if (!text || delay === -1) return;

  setTimeout(() => {
    phaseBannerString.set('');
  }, delay);
}
