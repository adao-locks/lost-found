import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
.catch(err => console.error(err));

providers: [
  provideStorage(() => getStorage())
]
