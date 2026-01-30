import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { routes } from "./app.routes";
import { provideIonicAngular } from '@ionic/angular/standalone';

// * primeng
import { provideHttpClient } from "@angular/common/http";
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideHttpClient(),
    DialogService,
    MessageService,
    ConfirmationService,
  ]}
