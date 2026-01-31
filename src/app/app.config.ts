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
import { addIcons } from "ionicons";
import { closeCircleOutline, informationCircle, image, checkmarkCircle, cloudUpload, power, camera, trash, alertCircle, star, addCircle, list } from "ionicons/icons";

// * workflow



addIcons({
  "close-circle-outline": closeCircleOutline,
  "information-circle": informationCircle,
  "image": image,
  "checkmark-circle": checkmarkCircle,
  "cloud-upload": cloudUpload,
  "power": power,
  "camera": camera,
  "trash": trash,
  "alert-circle": alertCircle,
  "star": star,
  "add-circle": addCircle,
  "list": list
})


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
  ]}

