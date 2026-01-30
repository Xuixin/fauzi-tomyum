import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ApiMenuAdapterService } from '../core/data/menu/adapter/api-menu-adapter.service';
import { MockMenuAdapterService } from '../core/data/menu/adapter/mock-menu-adapter.service';
import { MenuAdapterService } from '../core/data/menu/service/menu-adapter.service';

export function provideData(useMock: boolean = false): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Menu Data
    {
      provide: MenuAdapterService,
      useClass: useMock ? MockMenuAdapterService : ApiMenuAdapterService,
    },
  ]);
}
