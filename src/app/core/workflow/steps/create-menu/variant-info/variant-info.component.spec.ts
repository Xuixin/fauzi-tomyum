import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariantInfoComponent } from './variant-info.component';

describe('VariantInfoComponent', () => {
  let component: VariantInfoComponent;
  let fixture: ComponentFixture<VariantInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), VariantInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VariantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
