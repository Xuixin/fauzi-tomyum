import { Component } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseStepComponent } from '../../../core/base/base-step.component';
import { WorkflowStepService } from '../../../core/services/workflow-step';
import { AlertController } from '@ionic/angular';
import { IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';

/**
 * Step 2: Confirm Information
 * ตรวจสอบและยืนยันข้อมูล
 */
@Component({
  selector: 'app-step-confirm',
  templateUrl: './step-confirm.component.html',
  styleUrls: ['./step-confirm.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonButton, IonChip, IonCardContent, IonCardTitle, IonCardHeader, IonCard, CommonModule, IonIcon, FormsModule, ReactiveFormsModule]
})
export class StepConfirmComponent extends BaseStepComponent {

  userInfo: any = null;

  constructor(
    protected override workflowStep: WorkflowStepService,
    private alertController: AlertController
  ) {
    super(workflowStep);
  }

  /**
   * สร้างฟอร์ม (simple form สำหรับ checkbox)
   */
  protected buildForm(): FormGroup {
    return new FormGroup({
      acceptTerms: new FormControl(false)
    });
  }

  /**
   * Load data from previous step
   */
  protected override init(): void {
    // ดึงข้อมูลจาก step ก่อนหน้า
    this.userInfo = this.getStepData('user-info');

    console.log('User info from previous step:', this.userInfo);

    // Set form validity based on checkbox
    if (this.form) {
      this.form.get('acceptTerms')?.valueChanges.subscribe(checked => {
        this.workflowStep.setValid(checked);
        this.setCanGoNext(checked);

      });

    }
  }

  /**
   * Hook ก่อนไปขั้นตอนถัดไป (บันทึกข้อมูล)
   */
  protected override async beforeNext(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'ยืนยันการบันทึก',
      message: 'คุณต้องการบันทึกข้อมูลผู้ใช้งานนี้หรือไม่?',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel'
        },
        {
          text: 'ยืนยัน',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();

    // ถ้ายืนยัน ให้ทำการ "บันทึก" (จริงๆ ต้องเรียก API)
    if (role === 'confirm') {
      await this.saveUser();
      return true;
    }

    return false;
  }

  /**
   * Simulate saving user data
   */
  private async saveUser(): Promise<void> {
    // แสดง loading
    console.log('Saving user...', this.getAllData());

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('User saved successfully!');
  }

  /**
   * Get role label
   */
  getRoleLabel(roleValue: string): string {
    const roles: Record<string, string> = {
      user: 'ผู้ใช้ทั่วไป',
      admin: 'ผู้ดูแลระบบ',
      manager: 'ผู้จัดการ'
    };
    return roles[roleValue] || roleValue;
  }

  /**
   * กลับไปแก้ไขข้อมูล
   */
  editUserInfo(): void {
    this.goBack();
  }
}
