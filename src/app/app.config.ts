import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { routes } from "./app.routes";
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
// * primeng
import { provideHttpClient } from "@angular/common/http";
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { provideWorkflow } from "@core/workflow/workflow.provider";
import { provideData } from "./providers/data.provider";
import { loadIcon } from "@shared/utils/load-icon.utils";


loadIcon()



export const appConfig: ApplicationConfig = {
  providers: [
    ModalController,
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideHttpClient(),
    provideData(true),
    DialogService,
    MessageService,
    ConfirmationService,
    ...provideWorkflow(),
  ]
}

