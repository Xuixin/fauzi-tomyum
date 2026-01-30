import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoadingScreenComponent, ToastScreenComponent } from '@shared/component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    ToastScreenComponent,
    LoadingScreenComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }


}
