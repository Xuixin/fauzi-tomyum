// src/app/workflow/definitions/example-workflow.ts

import { WorkflowDefinition } from '../core/models/workflow-definition.model';
import { StepUserInfoComponent } from '../steps/example-workflow/step-user-info/step-user-info.component';
import { StepConfirmComponent } from '../steps/example-workflow/step-confirm/step-confirm.component';

/**
 * Example Workflow
 * ตัวอย่าง workflow แบบง่าย 2 steps
 */
export const ExampleWorkflow: WorkflowDefinition = {
  id: 'example-workflow',
  name: 'สร้างผู้ใช้งาน',
  description: 'ตัวอย่าง workflow สำหรับสร้างผู้ใช้งานใหม่',

  ui: {
    headerLabel: 'สร้างผู้ใช้งานใหม่',
    cancelLabel: 'ยกเลิก',
    showSidebar: false,
    showHeader: true,
    showCancelButtonHeader: true,
  },

  steps: [
    {
      id: 'user-info',
      name: 'ข้อมูลผู้ใช้',
      description: 'กรอกข้อมูลพื้นฐาน',
      component: StepUserInfoComponent,
      icon: 'person',
      nextButton: {
        label: 'ถัดไป',
        icon: 'arrow-forward',
      }
    },
    {
      id: 'confirm',
      name: 'ยืนยันข้อมูล',
      description: 'ตรวจสอบและยืนยัน',
      component: StepConfirmComponent,
      icon: 'checkmark-circle',
      nextButton: {
        label: 'บันทึก',
        icon: 'save',
        color: 'success',
      }
    }
  ]
};
