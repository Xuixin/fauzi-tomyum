import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appConfig } from './app/app.config';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#E3F4FF',
      100: '#B8E1FF',
      200: '#8DCEFF',
      300: '#62BAFF',
      400: '#38A7FF',
      500: '#0192FB',
      600: '#0178D3',
      700: '#015FAA',
      800: '#004681',
      900: '#002F59',
      950: '#001A33',
    },
  },
});

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: { darkModeSelector: false },
      },
      ripple: true,
      zIndex: {
        modal: 9000,
        overlay: 9500,
        menu: 10000,
        tooltip: 11000,
      },
    }),
  ],
});
