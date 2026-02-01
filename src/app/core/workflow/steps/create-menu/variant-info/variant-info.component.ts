import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseStepComponent } from '@core/workflow/core/base/base-step.component';
import { WorkflowStepService } from '@core/workflow/core/services/workflow-step';
import { WorkflowHelper } from '@core/workflow/utils/workflow.helpers';
import { FileHelper } from '@shared/utils/file.helper';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ImageUploadComponent } from '@shared/component/image-upload/image-upload.component';

interface VariantImagePreview {
  [index: number]: string | null;
}

@Component({
  selector: 'app-variant-info',
  templateUrl: './variant-info.component.html',
  styleUrls: ['./variant-info.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, InputTextModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, ImageUploadComponent]
})
export class VariantInfoComponent extends BaseStepComponent implements OnInit {
  private helper!: WorkflowHelper;

  parentNameMenu = '';
  parentMenu: any = null;
  parentImageMenuPreview: string | null = null;
  parentImageMenuFile: File | null = null;
  parentDefaultPrice = 0;
  selectedVariantIndex: number | null = 0; // เริ่มต้นเลือก variant แรก
  variantImagePreviews: VariantImagePreview = {};

  private objectUrls: string[] = []; // Track created URLs for cleanup

  waterHelperCreateVaraint = [
    {
      name: 'ร้อน',
      price: 0,
      is_default: true,
      is_active: true
    },
    {
      name: 'เย็น',
      price: 0,
      is_default: false,
      is_active: true
    },
    {
      name: 'ปั่น',
      price: 0,
      is_default: false,
      is_active: true
    },
  ];

  constructor(
    protected override workflowStep: WorkflowStepService,
    private cdr: ChangeDetectorRef
  ) {
    super(workflowStep);
  }


  override ngOnInit(): void {
    super.ngOnInit();
    this.beforeNext()
  }


  override async beforeNext(): Promise<boolean> {
    const formArray = this.variants;

    if (!formArray || formArray.length === 0) {
      return true;
    }

    const defaultIndex = formArray.controls.findIndex(
      c => c.get('is_default')?.value === true
    );

    // ไม่มี default → ไม่ยุ่ง
    if (defaultIndex === -1) {
      return true;
    }

    // default อยู่ index 0 แล้ว → ผ่าน
    if (defaultIndex === 0) {
      return true;
    }

    // ย้าย default ไป index 0
    const control = formArray.at(defaultIndex);
    formArray.removeAt(defaultIndex);
    formArray.insert(0, control);

    this.selectedVariantIndex = 0;

    console.log('🔁 Move default variant to index 0 before next');

    return true;
  }


  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Cleanup generated object URLs
    this.objectUrls.forEach(url => FileHelper.revokeObjectURL(url));
    this.objectUrls = [];
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      variants: new FormArray([], [Validators.required, Validators.minLength(1)])
    });
  }

  protected override async init(): Promise<void> {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);

    this.workflowStep.setValid(true);

    const data = this.getAllData();

    // โหลดชื่อเมนูจาก menu-info
    if (data && data['menu-info']) {
      const menuData = data['menu-info'];
      this.parentMenu = menuData;
      this.parentNameMenu = menuData.name || '';


      // Create Object URL for parent image if file exists
      if (menuData.imageFile instanceof File) {
        const url = FileHelper.createObjectURL(menuData.imageFile);
        this.objectUrls.push(url);
        this.parentImageMenuPreview = url;
      } else if (menuData.imageDisplay) {
        // Fallback if no file but has display string (legacy/backend)
        this.parentImageMenuPreview = menuData.imageDisplay;
      }

      this.parentImageMenuFile = menuData.imageFile;
      this.parentDefaultPrice = menuData.price || 0;
    }

    // โหลดข้อมูล variants ที่บันทึกไว้
    if (data && data['variant-info'] && data['variant-info'].variants) {
      const savedVariants = data['variant-info'].variants;


      // ล้าง variants เดิม
      while (this.variants.length > 0) {
        this.variants.removeAt(0);
      }

      // เพิ่ม variants จากข้อมูลที่บันทึกไว้
      savedVariants.forEach((variantData: any, index: number) => {
        const variantGroup = this.createVariantFormGroup();

        // ตั้งค่าข้อมูล
        variantGroup.patchValue({
          name: variantData.name || 'default',
          display_name: variantData.display_name || '',
          price: variantData.price || 0,
          sku: variantData.sku || '',
          kitchen_id: variantData.kitchen_id || '',
          is_default: variantData.is_default || false,
          is_active: variantData.is_active !== undefined ? variantData.is_active : true
        });

        // โหลดรูปภาพถ้ามี
        if (variantData.imageFile instanceof File) {
          // Use Object URL
          const url = FileHelper.createObjectURL(variantData.imageFile);
          this.objectUrls.push(url);
          this.variantImagePreviews[index] = url;
          variantGroup.get('imageFile')?.setValue(variantData.imageFile);
        } else if (variantData.imageDisplay) {
          this.variantImagePreviews[index] = variantData.imageDisplay;
        } else {
          // 👇 key point - use parent preview
          this.variantImagePreviews[index] = this.parentImageMenuPreview;
        }

        this.variants.push(variantGroup);
      });


      this.helper.navigation.enableNext()
    }

    // ถ้าไม่มี variant เลย ให้เพิ่ม default variant
    if (this.variants.length === 0) {
      this.addVariant();
    }

    // Sync form validity
    this.helper.form.autoSyncFormValidity();

    // Subscribe to name changes for auto-generating display_name
    this.variants.controls.forEach((control, index) => {
      control.get('display_name')?.disabled
      this.subscribeToNameChanges(control as FormGroup, index);
    });
  }

  get variants(): FormArray {
    return this.form?.get('variants') as FormArray;
  }

  createVariantFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('default', [Validators.required]),
      display_name: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      sku: new FormControl(''),
      imageFile: new FormControl<File | null>(null),
      kitchen_id: new FormControl('', [Validators.required]),
      is_default: new FormControl(false),
      is_active: new FormControl(true)
    });
  }

  addVariant(): void {
    const newVariant = this.createVariantFormGroup();
    const newIndex = this.variants.length;

    newVariant.get('price')?.setValue(this.parentDefaultPrice);

    // ถ้าเป็น variant แรก ให้ตั้งเป็น default
    if (newIndex === 0) {
      newVariant.get('is_default')?.setValue(true);
    }

    this.variants.push(newVariant);
    // Use parent image preview as default
    this.variantImagePreviews[newIndex] = this.parentImageMenuPreview;
    this.form?.markAsDirty();

    // Subscribe to name changes
    this.subscribeToNameChanges(newVariant, newIndex);

    // เลือก variant ที่เพิ่มใหม่
    this.selectVariant(newIndex);
  }


  addHelperVariant() {
    if (this.parentMenu.type === 'เครื่องดื่ม') {
      this.waterHelperCreateVaraint.forEach((variant: any) => {
        const newVariant = this.createVariantFormGroup();
        newVariant.patchValue(variant);
        this.variants.push(newVariant);
      });
    }
  }

  isWaterType(): boolean {
    return this.parentMenu.type === 'เครื่องดื่ม';
  }

  removeVariant(index: number): void {
    if (this.variants.length > 1) {
      // ถ้าลบ variant ที่เลือกอยู่ ให้เลือก variant แรก
      if (this.selectedVariantIndex === index) {
        this.selectedVariantIndex = 0;
      } else if (this.selectedVariantIndex !== null && this.selectedVariantIndex > index) {
        this.selectedVariantIndex--;
      }

      // ลบ image preview
      delete this.variantImagePreviews[index];

      // ถ้า variant ที่ลบเป็น default ให้ตั้ง variant แรกเป็น default
      const wasDefault = this.variants.at(index).get('is_default')?.value;
      this.variants.removeAt(index);

      if (wasDefault && this.variants.length > 0) {
        this.variants.at(0).get('is_default')?.setValue(true);
      }

      this.form?.markAsDirty();
    }
  }

  selectVariant(index: number): void {
    this.selectedVariantIndex = index;
  }

  onVariantFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file) {
      console.log('📁 Variant file selected:', {
        index,
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('❌ Invalid file type');
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('❌ File too large');
        alert('ไฟล์มีขนาดเกิน 5MB');
        return;
      }

      // Set file to form control
      this.variants.at(index).get('imageFile')?.setValue(file);
      this.variants.at(index).get('imageFile')?.markAsTouched();

      // Convert to base64 for preview
      this.convertFileToBase64AndSetPreview(file, index);


    }
  }

  private convertFileToBase64AndSetPreview(file: File, index: number): void {
    // Refactored to use Object URL
    const url = FileHelper.createObjectURL(file);
    this.objectUrls.push(url);

    this.variantImagePreviews[index] = url;
    this.cdr.detectChanges();
    console.log('✅ Variant image preview updated for index (Object URL):', index);
  }




  getVariantImagePreview(index: number): string | null {
    return this.variantImagePreviews[index] ?? this.parentImageMenuPreview ?? null;
  }

  clearVariantImage(index: number): void {
    this.variantImagePreviews[index] = null;
    this.variants.at(index).get('imageFile')?.setValue(null);
    this.variants.at(index).get('imageFile')?.markAsTouched();
  }

  setAsDefault(index: number): void {
  const formArray = this.variants;

  // reset ทุกตัว
  formArray.controls.forEach(c =>
    c.get('is_default')?.setValue(false)
  );

  // ตั้ง default ตัวที่เลือก
  formArray.at(index).get('is_default')?.setValue(true);

  this.selectedVariantIndex = index;

  console.log('⭐ Set variant', index, 'as default (no reorder)');
}


  private subscribeToNameChanges(variantGroup: FormGroup, index: number): void {
    const nameControl = variantGroup.get('name');
    const displayNameControl = variantGroup.get('display_name');

    if (nameControl && displayNameControl) {
      nameControl.valueChanges.subscribe((name: string) => {
        // ถ้า name เป็น 'default' ให้ใช้ชื่อเมนูหลัก
        if (name && name.toLowerCase() === 'default') {
          displayNameControl.setValue(this.parentNameMenu, { emitEvent: false });
          displayNameControl.disable({ emitEvent: false });
        } else if (name) {
          // ถ้ามีชื่อ ให้รวมกับชื่อเมนูหลัก
          displayNameControl.enable({ emitEvent: false });
          if (this.parentNameMenu) {
            displayNameControl.setValue(`${this.parentNameMenu}${name}`, { emitEvent: false });
          }
        }
      });

      // เรียก valueChanges ครั้งแรกเพื่อ set ค่าเริ่มต้น
      if (nameControl.value) {
        nameControl.setValue(nameControl.value);
      }
    }
  }

  getSelectedVariantForm(): FormGroup | null {
    if (this.selectedVariantIndex !== null) {
      return this.variants.at(this.selectedVariantIndex) as FormGroup;
    }
    return null;
  }
}
