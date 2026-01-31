import { WorkflowDefinition } from '../core/models/workflow-definition.model';
import { ConfirmMenuComponent } from '../steps/create-menu/confirm-menu/confirm-menu.component';
import { MenuInfoComponent } from '../steps/create-menu/menu-info/menu-info.component';
import { MenuOptionsComponent } from '../steps/create-menu/menu-options/menu-options.component';
import { VariantInfoComponent } from '../steps/create-menu/variant-info/variant-info.component';


export const CreateMenuWorkflow: WorkflowDefinition = {
  id: 'create-menu',
  name: 'สร้างเมนูใหม่',
  description: 'สร้างเมนูใหม่',
  ui: {
    headerLabel: 'สร้างเมนูใหม่',
    showSidebar: true,
    showHeader: true,
    showCancelButtonHeader: true,
  },
  steps: [
    {
      id: 'menu-info',
      name: 'ข้อมูลเมนู',
      description: 'กรอกข้อมูลเมนู',
      component: MenuInfoComponent,
      icon: 'restaurant',
      nextButton: {
        label: 'ถัดไป',
        icon: 'arrow-forward',
      }
    },
    {
      id: 'variant-info',
      name: 'ตัวเลือกเมนู',
      description: 'กรอกข้อมูลตัวเลือกเมนู (Variants)',
      component: VariantInfoComponent,
      icon: 'list',
      nextButton: {
        label: 'ถัดไป',
        icon: 'arrow-forward',
      }
    },
    {
      id: 'menu-options',
      name: 'ตัวเลือกเพิ่มเติม',
      description: 'กรอกข้อมูลตัวเลือกเพิ่มเติม (Options)',
      component: MenuOptionsComponent,
      icon: 'options',
      nextButton: {
        label: 'ถัดไป',
        icon: 'arrow-forward',
      }
    },
    {
      id: 'confirm-menu',
      name: 'ยืนยันเมนู',
      description: 'ยืนยันเมนู',
      component: ConfirmMenuComponent,
      icon: 'checkmark-circle',
      nextButton: {
        label: 'สร้างเมนู',
        icon: 'checkmark',
      }
    }
  ]
}
