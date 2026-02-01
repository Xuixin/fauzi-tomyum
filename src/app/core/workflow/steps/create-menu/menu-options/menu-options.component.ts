import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseStepComponent } from '../../../core/base/base-step.component';
import { WorkflowStepService } from '../../../core/services/workflow-step';
import { WorkflowHelper } from '@core/workflow/utils/workflow.helpers';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ButtonModule } from 'primeng/button';


import { InputTextModule } from 'primeng/inputtext';

interface MenuOptionGroup {
  name: string;
  required: boolean;
  multiple: boolean;
  items: MenuOptionItem[];
}

interface MenuOptionItem {
  name: string;
  price: number;
}


@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.component.html',
  styleUrls: ['./menu-options.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule ]
})
export class MenuOptionsComponent extends BaseStepComponent {
  private helper!: WorkflowHelper;

  menuInfo: any = null;
  selectedOptionIndex: number | null = null;


  quickAddOption: any[] = [
    {
      config: {
        icon: 'restaurant',
        iconStyle: 'text-white!',
        iconBgColor: 'bg-blue-500',
        buttonColor: 'border-blue-500 bg-blue-100 border-blue-500  hover:border-orange-500 hover:shadow-md',
        click:() => this.addSweetLevelTemplate()
      },
      name: 'ระดับความหวาน',
      required: true,
      multiple: false,
      items: [
        {
          name: " ไม่หวาน",
          price: 0
        },
        {
          name: 'หวานน้อย',
          price: 0
        },
        {
          name: "หวานปานกลาง",
          price: 0
        },
        {
          name: 'หวานมาก',
          price: 0
        }
      ]
    },
    {
      config: {
        icon: 'restaurant',
        iconStyle: 'text-white!',
        iconBgColor: 'bg-orange-500',
        buttonColor: 'border-orange-500 bg-orange-100 border-orange-500 bg-orange-100 hover:border-orange-500 hover:shadow-md',
        click: () => this.addToppingTemplate()
      },
      name: 'ท็อปปิ้ง',
      required: false,
      multiple: true,
      items: [
        {
          name: " ไข่ดาว",
          price: 10
        },
        {
          name: 'ชีส',
          price: 15
        },
        {
          name: "เบคอน",
          price: 20
        },

      ]
    }
  ]

  constructor(protected override workflowStep: WorkflowStepService) {
    super(workflowStep);
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      options: new FormArray([])
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);

    // ดึงข้อมูลจาก step ก่อนหน้า
    this.menuInfo = this.getStepData('menu-info');
    const currentData: any = this.getCurrentStepData();

    // โหลดข้อมูล options ที่บันทึกไว้
    if (currentData && currentData.options) {
      const savedOptions = currentData.options;

      // ล้าง options เดิม
      while (this.optionsArray.length > 0) {
        this.optionsArray.removeAt(0);
      }

      // เพิ่ม options จากข้อมูลที่บันทึกไว้
      savedOptions.forEach((optionData: any, index: number) => {
        const optionGroup = this.createOptionFormGroup();

        // ตั้งค่าข้อมูล
        optionGroup.patchValue({
          name: optionData.name || '',
          required: optionData.required || false,
          multiple: optionData.multiple || false
        });

        // เพิ่ม items
        const itemsArray = optionGroup.get('items') as FormArray;
        if (optionData.items && optionData.items.length > 0) {
          optionData.items.forEach((itemData: any) => {
            const item = new FormGroup({
              name: new FormControl(itemData.name || '', [Validators.required]),
              price: new FormControl(itemData.price || 0, [Validators.required, Validators.min(0)])
            });
            itemsArray.push(item);
          });
        }

        this.optionsArray.push(optionGroup);
      });

      // เลือก option แรก
      if (this.optionsArray.length > 0) {
        this.selectedOptionIndex = 0;
      }
    }

    // Set initial validity - ไม่บังคับต้องมี options
    this.workflowStep.setValid(true);
    this.setCanGoNext(true);

    console.log('Menu info from previous step:', this.menuInfo);
  }

  get optionsArray(): FormArray {
    return this.form?.get('options') as FormArray;
  }

  private createOptionFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      required: new FormControl(false),
      multiple: new FormControl(false),
      items: new FormArray([])
    });
  }

  /**
   * เลือกกลุ่ม option
   */
  selectOptionGroup(index: number): void {
    this.selectedOptionIndex = index;
  }

  /**
   * เพิ่มกลุ่ม Option ใหม่
   */
  addOptionGroup(): void {
    const optionGroup = this.createOptionFormGroup();

    this.optionsArray.push(optionGroup);

    // เพิ่ม item แรกให้อัตโนมัติ
    this.addOptionItem(this.optionsArray.length - 1);

    // เลือก option ที่เพิ่มใหม่
    this.selectedOptionIndex = this.optionsArray.length - 1;

    this.form?.markAsDirty();
  }

  /**
   * ลบกลุ่ม Option
   */
  removeOptionGroup(index: number): void {
    if (this.optionsArray.length > 0) {
      // ถ้าลบ option ที่เลือกอยู่
      if (this.selectedOptionIndex === index) {
        // ถ้ายังมี options อื่นอยู่ ให้เลือก option แรก
        if (this.optionsArray.length > 1) {
          this.selectedOptionIndex = 0;
        } else {
          this.selectedOptionIndex = null;
        }
      } else if (this.selectedOptionIndex !== null && this.selectedOptionIndex > index) {
        this.selectedOptionIndex--;
      }

      this.optionsArray.removeAt(index);
      this.form?.markAsDirty();
    }
  }

  /**
   * เพิ่มรายการ Option Item
   */
  addOptionItem(groupIndex: number): void {
    const optionGroup = this.optionsArray.at(groupIndex) as FormGroup;
    const itemsArray = optionGroup.get('items') as FormArray;

    const item = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    itemsArray.push(item);
    this.form?.markAsDirty();
  }

  /**
   * ลบรายการ Option Item
   */
  removeOptionItem(groupIndex: number, itemIndex: number): void {
    const optionGroup = this.optionsArray.at(groupIndex) as FormGroup;
    const itemsArray = optionGroup.get('items') as FormArray;

    if (itemsArray.length > 1) {
      itemsArray.removeAt(itemIndex);
      this.form?.markAsDirty();
    }
  }

  /**
   * ดึง items array ของกลุ่ม option
   */
  getOptionItems(groupIndex: number): FormArray {
    const optionGroup = this.optionsArray.at(groupIndex) as FormGroup;
    return optionGroup.get('items') as FormArray;
  }

  /**
   * ดึง form group ของ option ที่เลือก
   */
  getSelectedOptionForm(): FormGroup | null {
    if (this.selectedOptionIndex !== null) {
      return this.optionsArray.at(this.selectedOptionIndex) as FormGroup;
    }
    return null;
  }

  /**
   * ข้ามไปขั้นตอนถัดไปโดยไม่ต้องมี options
   */
  skipOptions(): void {
    this.saveDataNow({ options: [] });
    this.goNext();
  }

  /**
   * เพิ่ม Template: ระดับความหวาน
   */
  addSweetLevelTemplate(): void {
    const optionGroup = this.createOptionFormGroup();

    // ตั้งค่ากลุ่ม
    optionGroup.patchValue({
      name: 'ระดับความหวาน',
      required: true,
      multiple: false
    });

    // เพิ่มรายการ
    const itemsArray = optionGroup.get('items') as FormArray;
    const sweetLevels = [
      { name: 'ไม่หวาน', price: 0 },
      { name: 'หวานน้อย', price: 0 },
      { name: 'หวานปานกลาง', price: 0 },
      { name: 'หวานมาก', price: 0 }
    ];

    sweetLevels.forEach(level => {
      const item = new FormGroup({
        name: new FormControl(level.name, [Validators.required]),
        price: new FormControl(level.price, [Validators.required, Validators.min(0)])
      });
      itemsArray.push(item);
    });

    this.optionsArray.push(optionGroup);
    this.selectedOptionIndex = this.optionsArray.length - 1;
    this.form?.markAsDirty();
  }

  /**
   * เพิ่ม Template: ท็อปปิ้ง
   */
  addToppingTemplate(): void {
    const optionGroup = this.createOptionFormGroup();

    // ตั้งค่ากลุ่ม
    optionGroup.patchValue({
      name: 'ท็อปปิ้ง',
      required: false,
      multiple: true
    });

    // เพิ่มรายการ
    const itemsArray = optionGroup.get('items') as FormArray;
    const toppings = [
      { name: 'ไข่ดาว', price: 10 },
      { name: 'ชีส', price: 15 },
      { name: 'เบคอน', price: 20 }
    ];

    toppings.forEach(topping => {
      const item = new FormGroup({
        name: new FormControl(topping.name, [Validators.required]),
        price: new FormControl(topping.price, [Validators.required, Validators.min(0)])
      });
      itemsArray.push(item);
    });

    this.optionsArray.push(optionGroup);
    this.selectedOptionIndex = this.optionsArray.length - 1;
    this.form?.markAsDirty();
  }

  /**
   * Hook ก่อนไปขั้นตอนถัดไป
   */
  protected override async beforeNext(): Promise<boolean> {
    // ถ้าไม่มี options ก็ให้ผ่านได้
    if (this.optionsArray.length === 0) {
      return true;
    }

    // ถ้ามี options ต้อง validate
    if (!this.form?.valid) {
      this.markFormAsTouched();
      return false;
    }

    return true;
  }
}
