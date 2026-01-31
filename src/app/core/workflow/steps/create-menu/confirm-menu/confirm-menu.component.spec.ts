import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfirmMenuComponent } from './confirm-menu.component';

describe('ConfirmMenuComponent', () => {
  let component: ConfirmMenuComponent;
  let fixture: ComponentFixture<ConfirmMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ConfirmMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
