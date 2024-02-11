import Rollbar from 'rollbar';

import { type ErrorHandler, Injectable } from '@angular/core';

import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class RollbarService {
  private rollbar!: Rollbar;

  public get rollbarInstance() {
    return this.rollbar;
  }

  constructor() {}

  init() {
    const rollbarConfig = {
      accessToken: environment.rollbar.token,
      captureUncaught: true,
      captureUnhandledRejections: true,
      hostBlockList: ['netlify.app'],
      payload: {
        environment: environment.rollbar.environment,
      },
    };

    this.rollbar = new Rollbar(rollbarConfig);
  }
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private rollbar: RollbarService) {
    window.onerror = (err) => this.handleError(err as unknown as Error);
  }

  private isValidError(err: Error): boolean {
    if (!err.message) return false;

    return true;
  }

  handleError(err: Error): void {
    console.error(err);

    if (!this.isValidError(err)) {
      return;
    }

    // send the error, and possibly the savefile
    this.rollbar.rollbarInstance?.error(err);
  }
}
