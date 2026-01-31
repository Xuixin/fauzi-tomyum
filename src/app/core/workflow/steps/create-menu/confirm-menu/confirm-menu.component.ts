import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BaseStepComponent } from '../../../core/base/base-step.component';
import { WorkflowStepService } from '../../../core/services/workflow-step';
import { AlertController } from '@ionic/angular';
import { CreateMenuRequestDTO, MenuFacadeService } from '@core/data/menu';
import { FileHelper } from '@shared/utils/file.helper';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-confirm-menu',
  templateUrl: './confirm-menu.component.html',
  styleUrls: ['./confirm-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, ButtonModule]
})
export class ConfirmMenuComponent extends BaseStepComponent {

  menuInfo: any = null;
  variantInfo: any = null;
  optionInfo: any = null;
  isCreating = false;

  menuImageUrl?: string;
  variants: any[] = [];


  constructor(
    protected override workflowStep: WorkflowStepService,
    private alertController: AlertController,
    private menuFacade: MenuFacadeService
  ) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      confirmCreate: new FormControl(false)
    });
  }

  protected override init(): void {
    // ดึงข้อมูลจาก step ก่อนหน้า
    this.menuInfo = this.getStepData('menu-info');
    this.variantInfo = this.getStepData('variant-info');
    this.optionInfo = this.getStepData('menu-options');


    if (this.menuInfo?.imageFile instanceof File) {
      this.menuInfo.imageDisplay = FileHelper.createObjectURL(this.menuInfo.imageFile);
      this.initVariants();
    }

    // Set form validity based on checkbox
    if (this.form) {
      this.form.get('confirmCreate')?.valueChanges.subscribe(checked => {
        this.workflowStep.setValid(checked);
        this.setCanGoNext(checked);
      });
    }
  }


  initVariants() {
    const rawVariants = this.variantInfo?.variants || [];

    this.variants = rawVariants.map((variant: any) => {
      let imageDisplay: string | undefined;

      if (variant.imageFile instanceof File) {
        imageDisplay = FileHelper.createObjectURL(variant.imageFile);
      } else {
        imageDisplay = this.menuInfo.imageDisplay; // fallback
      }

      return {
        ...variant,
        imageDisplay
      };
    });
  }
  protected override async beforeNext(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'ยืนยันการสร้างเมนู',
      message: 'คุณต้องการสร้างเมนูนี้หรือไม่?',
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

    if (role === 'confirm') {
      await this.createMenu();
      return true;
    }

    return false;
  }

  private async createMenu(): Promise<void> {
    this.isCreating = true;

    try {
      // Prepare menu data
      const menuData: CreateMenuRequestDTO = {
        type: this.menuInfo.type,
        sub_type: this.menuInfo.sub_type,
        name: this.menuInfo.name,
        image_url: this.menuInfo.imageDisplay,
        is_active: this.menuInfo.is_active ?? true,
        variants: this.variantInfo?.variants || [],
        options: this.optionInfo?.options || []
      };

      console.log('Creating menu:', menuData);

      // Call API
      await this.menuFacade.createMenu(menuData);

      console.log('Menu created successfully!');

      // Show success alert
      const successAlert = await this.alertController.create({
        header: 'สำเร็จ',
        message: 'สร้างเมนูเรียบร้อยแล้ว',
        buttons: ['ตกลง']
      });
      await successAlert.present();

    } catch (error) {
      console.error('Error creating menu:', error);

      // Show error alert
      const errorAlert = await this.alertController.create({
        header: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถสร้างเมนูได้ กรุณาลองใหม่อีกครั้ง',
        buttons: ['ตกลง']
      });
      await errorAlert.present();

    } finally {
      this.isCreating = false;
    }
  }

  editMenuInfo(): void {
    this.goToStep('menu-info');
  }

  editVariantInfo(): void {
    this.goToStep('variant-info');
  }

  editOptionInfo(): void {
    this.goToStep('menu-options');
  }

  getMinPrice(): number {
    if (!this.variantInfo?.variants || this.variantInfo.variants.length === 0) return 0;
    return Math.min(...this.variantInfo.variants.map((v: any) => v.price));
  }

  getMaxPrice(): number {
    if (!this.variantInfo?.variants || this.variantInfo.variants.length === 0) return 0;
    return Math.max(...this.variantInfo.variants.map((v: any) => v.price));
  }

  getTypeLabel(type: string): string {
    const types: Record<string, string> = {
      food: 'อาหาร',
      drink: 'เครื่องดื่ม',
      'อาหาร': 'อาหาร',
      'เครื่องดื่ม': 'เครื่องดื่ม'
    };
    return types[type] || type;
  }

  getSubTypeLabel(subType: string): string {
    const subTypes: Record<string, string> = {
      rice: 'ข้าว',
      noodle: 'ก๋วยเตี๋ยว',
      coffee: 'กาแฟ',
      tea: 'ชา',
      juice: 'น้ำผลไม้',
      'อาหารจานเดียว': 'อาหารจานเดียว',
      'ซุป': 'ซุป',
      'เครื่องดื่มร้อน': 'เครื่องดื่มร้อน',
      'เครื่องดื่มเย็น': 'เครื่องดื่มเย็น'
    };
    return subTypes[subType] || subType;
  }
}
