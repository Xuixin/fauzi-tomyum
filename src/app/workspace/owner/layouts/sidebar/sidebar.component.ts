import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { speedometerOutline, restaurantOutline, flameOutline, qrCodeOutline } from 'ionicons/icons';


interface MenuListItem {
  titleKey: string;     // เช่น PAGE.MAIN
  menu: MenuItem[];
}

interface MenuItem {
  id: string;
  labelKey: string;
  route: string;
  icon: string;        // 👈 เพิ่ม
  disabled?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [IonIcon,CommonModule ]
})
export class SidebarComponent implements OnInit {

  project_name: string = 'จัดการร้านค้า' // TODO : next import from api
  selected_id: string = ''

  icon: { [key: string]: SafeHtml } = {};

  menuItemList: MenuListItem[] = [
    {
      titleKey: 'แดชบอร์ด',
      menu: [
        {
          id: 'dashboard',
          labelKey: 'แดชบอร์ด',
          route: '/owner/dashboard',
          icon: 'speedometer-outline',
        },
      ],
    },
    {
      titleKey: 'จัดการร้านค้า',
      menu: [
        {
          id: 'menu',
          labelKey: 'จัดการเมนู',
          route: '/owner/menu',
          icon: 'restaurant-outline',
        },
        {
          id: 'menu-set',
          labelKey: 'จัดการเมนูเซ็ต',
          route: '/owner/menu-set',
          icon: 'restaurant-outline',
        },
        {
          id: 'kitchen',
          labelKey: 'จัดการครัว',
          route: '/kitchen',
          icon: 'flame-outline',
        },
        {
          id: 'table',
          labelKey: 'จัดการโต๊ะ',
          route: '/table',
          icon: 'qr-code-outline',
        },
      ],
    },
  ];



  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ speedometerOutline, restaurantOutline, flameOutline, qrCodeOutline });
  }

  ngOnInit() {
    this.setActiveFromUrl(this.router.url);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.setActiveFromUrl(e.urlAfterRedirects);
      });
  }

  private setActiveFromUrl(url: string) {
    for (const group of this.menuItemList) {
      const found = group.menu.find(m => url.startsWith(m.route));
      if (found) {
        this.selected_id = found.id;
        return;
      }
    }
  }


  selectMenu(id: string) {
    this.selected_id = id
    this.onSelectMenu(id)
  }


  onSelectMenu(id: string) {
    const route = this.menuItemList.find(group => group.menu.some(menu => menu.id === id))?.menu.find(menu => menu.id === id)?.route;
    this.router.navigate([route]);
  }

}
