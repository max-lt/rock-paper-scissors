import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { GameFairnessComponent } from './game-fairness/game-fairness.component';
import { GuessNamePipe } from './guess-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameFairnessComponent,
    GuessNamePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
