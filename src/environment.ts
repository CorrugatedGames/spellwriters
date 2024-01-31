import { isDevMode } from '@angular/core';

export const environment = {
  rollbar: {
    token: '443c1a4630084b49bf7dbe749708801b',
    environment: isDevMode() ? 'local' : 'production',
  },
};
