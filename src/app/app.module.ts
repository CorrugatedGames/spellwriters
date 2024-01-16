import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentService } from './services/content.service';
import { GameStateService } from './services/game-state.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgxWebstorageModule.forRoot()],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ContentService, GameStateService],
      useFactory:
        (contentService: ContentService, gameStateService: GameStateService) =>
        async () => {
          await contentService.init();
          await gameStateService.init();
        },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
