import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `Here is a server-generated random number: {{ random$ | async }}`,
  styles: []
})
export class AppComponent {
  public readonly random$: Promise<number>;

  constructor() {
    this.random$ = fetch('/api/random')
      .then((res) => res.json())
      .then((json) => json.random);
  }
}
