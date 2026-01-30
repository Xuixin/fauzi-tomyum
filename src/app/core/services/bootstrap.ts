import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export type AppEntry = 'owner' | 'pos' | 'kitchen' | 'customer' | 'login';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  async resolveEntry(): Promise<void> {
    // 1. ลูกค้า (QR)
    const qrToken = this.getQrToken();
    if (qrToken) {
      await Preferences.set({
        key: 'entry',
        value: 'customer'
      })
      this.router.navigateByUrl('/customer/menu');
      return;
    }

    // 2. staff
    const session = await this.getSession();
    if (!session) {

      this.router.navigateByUrl('/login');
      return;
    }

    // 3. route by role
    switch (session.role) {
      case 'owner':
        await Preferences.set({
          key: 'entry',
          value: 'owner'
        })
        this.router.navigateByUrl('/owner/dashboard', {
          replaceUrl: true,
        });
        break;

      case 'pos':
        await Preferences.set({
          key: 'entry',
          value: 'pos'
        })
        this.router.navigateByUrl('/pos/orders', {
          replaceUrl: true,
        });
        break;

      case 'kitchen':
        await Preferences.set({
          key: 'entry',
          value: 'kitchen'
        })
        this.router.navigateByUrl(`/kitchen/board/${session.kitchen_id}`, {
          replaceUrl: true,
        });
        break;

      default:
        this.router.navigateByUrl('/login');
    }
  }

  private getQrToken(): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get('table');
  }

  // getSession for test first
  async getSession(): Promise<{ role: AppEntry; kitchen_id?: string }> {
    return {
      role: 'owner',
    };
  }
}
