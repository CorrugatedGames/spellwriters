import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentService } from './services/content.service';
import { GameStateService } from './services/game-state.service';
import { MetaService } from './services/meta.service';
import {
  RollbarErrorHandler,
  RollbarService,
} from './services/rollbar.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    AngularSvgIconModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [MetaService, RollbarService, ContentService, GameStateService],
      useFactory:
        (
          metaService: MetaService,
          rollbarService: RollbarService,
          contentService: ContentService,
          gameStateService: GameStateService,
        ) =>
        async () => {
          await metaService.init();
          await rollbarService.init();
          await contentService.init();
          await gameStateService.init();
        },
    },

    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
