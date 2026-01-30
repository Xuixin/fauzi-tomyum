import { Component, OnInit } from '@angular/core';
import { IonContent, IonSplitPane, IonRouterOutlet, IonMenu } from "@ionic/angular/standalone";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-page-container',
  templateUrl: './owner-page-container.component.html',
  styleUrls: ['./owner-page-container.component.scss'],
  standalone: true,
  imports: [ IonSplitPane, SidebarComponent, IonRouterOutlet, CommonModule ,IonMenu]
})
export class OwnerPageContainerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
