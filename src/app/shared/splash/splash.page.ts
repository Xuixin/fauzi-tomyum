import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';

import { IonContent, IonImg } from '@ionic/angular/standalone';
import type { Animation } from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BootstrapService } from '@core/services/bootstrap';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonImg, IonContent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SplashPage implements AfterViewInit {
  @ViewChild('logoImg', { read: ElementRef })
  logoImg!: ElementRef;
  @ViewChild('topImg', { read: ElementRef })
  topImg!: ElementRef;
  @ViewChild('bottomImg', { read: ElementRef })
  bottomImg!: ElementRef;

  // assets
  public logo = '/assets/logo/logo.svg';
  public top = '/assets/logo/splash_top.svg';
  public bottom = '/assets/logo/splash_bottom.png';

  // instant anumation
  private logoAnimation!: Animation;
  private topAnimation!: Animation;
  private bottomAnimation!: Animation;
  private buttonAnimation!: Animation;

  constructor(
    private animationCtrl: AnimationController,
    private navCtrl: NavController,
    private bootstrapService: BootstrapService,
  ) {}

  ngAfterViewInit() {
    this.initializeElements();
    this.startSequentialAnimations();
  }

  private initializeElements() {
    // Initialize all elements as invisible
    this.logoImg.nativeElement.style.opacity = '0';
    this.logoImg.nativeElement.style.transform = 'translateY(50px) scale(0.8)';

    this.topImg.nativeElement.style.opacity = '0';
    this.topImg.nativeElement.style.transform = 'translateY(-100px)';

    this.bottomImg.nativeElement.style.opacity = '0';
    this.bottomImg.nativeElement.style.transform = 'translateY(100px)';
  }

  private startSequentialAnimations() {
    setTimeout(() => {
      this.animateBackgroundElements();
    }, 500);

    setTimeout(() => {
      this.animateLogo();
    }, 1000);
  }

  private animateBackgroundElements() {
    // Animate top image
    this.topAnimation = this.animationCtrl
      .create()
      .addElement(this.topImg.nativeElement)
      .duration(800)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(-100px)', 'translateY(0px)');

    // Animate bottom image
    this.bottomAnimation = this.animationCtrl
      .create()
      .addElement(this.bottomImg.nativeElement)
      .duration(800)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(100px)', 'translateY(0px)');

    // Play both animations simultaneously
    this.topAnimation.play();
    this.bottomAnimation.play();
  }

  private animateLogo() {
    this.logoAnimation = this.animationCtrl
      .create()
      .addElement(this.logoImg.nativeElement)
      .duration(1000)
      .easing('cubic-bezier(0.25, 0.46, 0.45, 0.94)')
      .fromTo('opacity', '0', '1')
      .fromTo(
        'transform',
        'translateY(50px) scale(0.8)',
        'translateY(0px) scale(1)',
      )
      .afterStyles({
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
      });

    this.logoAnimation.play();

    this.logoAnimation.onFinish(() => {
      this.addPulseEffect();
    });
  }

  private addPulseEffect() {
    const pulseAnimation = this.animationCtrl
      .create()
      .addElement(this.logoImg.nativeElement)
      .duration(1500)
      .iterations(2)
      .direction('alternate')
      .easing('ease-in-out')
      .fromTo('transform', 'scale(1)', 'scale(1.05)');

    pulseAnimation.play();

    pulseAnimation.onFinish(async () => {
      // TODO: check if user is logged in
      await this.bootstrapService.resolveEntry();
    });
  }
}
