// See https://svelte.dev/docs/kit/types#app.d.ts
/// <reference types="@openworkers/workers-types" />

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        COOKIE_SECRET?: string;
        DATABASE: BindingDatabase;
        ASSETS?: BindingAssets;
      };
    }
  }
}

export {};
