import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseStepComponent } from '../../../core/base/base-step.component';
import { WorkflowStepService } from '../../../core/services/workflow-step';
import { IonItem, IonLabel, IonInput, IonNote, IonCard, IonCardContent, IonIcon } from "@ionic/angular/standalone";

import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";

/**
 * Step 1: User Information
 * กรอกข้อมูลพื้นฐานของผู้ใช้
 */
@Component({
  selector: 'app-step-user-info',
  templateUrl: './step-user-info.component.html',
  styleUrls: ['./step-user-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
]
})
export class StepUserInfoComponent extends BaseStepComponent {

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  /**
   * สร้างฟอร์ม (required method)
   */
  protected buildForm(): FormGroup {
    return new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]),
      role: new FormControl('user', Validators.required)
    });
  }

  /**
   * Custom initialization (optional)
   */
  protected override init(): void {
    console.log('Step User Info initialized');
  }

  /**
   * Get form controls for easy access in template
   */
  get f() {
    return this.form?.controls;
  }

  /**
   * Available roles
   */
  roles = [
    { value: 'user', label: 'ผู้ใช้ทั่วไป' },
    { value: 'admin', label: 'ผู้ดูแลระบบ' },
    { value: 'manager', label: 'ผู้จัดการ' }
  ];
}
