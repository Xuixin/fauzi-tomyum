import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonHeader]
})
export class HeaderComponent implements OnInit {

  @Input() header: string = ''
  @Input() backUrl?: string | null = null
  @Input() variant: 'mobile' | 'web' = 'mobile'

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  back() {
    if (this.backUrl)
      this.navCtrl.navigateBack(this.backUrl)
  }

  toggleLanguage(lg: string) { }

}
