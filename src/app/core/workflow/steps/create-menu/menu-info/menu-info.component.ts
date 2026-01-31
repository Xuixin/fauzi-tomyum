import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseStepComponent } from '@core/workflow/core/base/base-step.component';
import { WorkflowStepService } from '@core/workflow/core/services/workflow-step';
import { WorkflowHelper } from '@core/workflow/utils/workflow.helpers';
import { FileHelper } from '@shared/utils/file.helper';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ImageUploadComponent } from '@shared/component/image-upload/image-upload.component';

@Component({
  selector: 'app-menu-info',
  templateUrl: './menu-info.component.html',
  styleUrls: ['./menu-info.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, InputTextModule, ButtonModule, FormsModule, ReactiveFormsModule, ImageUploadComponent]
})
export class MenuInfoComponent extends BaseStepComponent implements OnInit {
  private helper!: WorkflowHelper;

  imageDisplay: string | null = null;
  private objectUrls: string[] = []; // เก็บ list ของ url ที่สร้างขึ้นเพื่อ cleanup

  showType = true;
  showSubType = false;
  subType: any[] = [];


  helperTypeSelect = [
    {
      name: 'อาหาร',
      value: 'อาหาร',
      sub_type: [
        {
          name: 'อาหารจานเดียว',
          value: 'อาหารจานเดียว'
        },
        {
          name: 'ซุป',
          value: 'ซุป'
        }
      ]
    },
    {
      name: 'เครื่องดื่ม',
      value: 'เครื่องดื่ม',
      sub_type: [
        {
          name: 'เครื่องดื่มร้อน',
          value: 'เครื่องดื่มร้อน'
        },
        {
          name: 'เครื่องดื่มเย็น',
          value: 'เครื่องดื่มเย็น'
        }
      ]
    }
  ]

  constructor(
    protected override workflowStep: WorkflowStepService,
    private cdr: ChangeDetectorRef
  ) {
    super(workflowStep);
  }

  onClickTypeHelper(item: any) {

    this.form?.get('type')?.setValue(item.value);

    this.showSubType = true;
    this.subType = item.sub_type;
    this.showType = false;
    this.cdr.detectChanges();
  }


  onClickSubTypeHelper(item: any) {

    this.form?.get('sub_type')?.setValue(item.value);

    this.showSubType = false;
    this.showType = false;
    this.subType = [];
    this.cdr.detectChanges();
  }

  // Cleanup object URL เมื่อ component ถูก destroy
  override ngOnDestroy(): void {
    this.objectUrls.forEach(url => FileHelper.revokeObjectURL(url));
    this.objectUrls = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected buildForm() {
    return new FormGroup({
      type: new FormControl('', [Validators.required]),
      sub_type: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      is_active: new FormControl(true),
      imageFile: new FormControl<File | null>(null, [Validators.required])
    });
  }

  protected override init(): void {
    this.helper = WorkflowHelper.create(this.workflowStep, this.form);
    this.helper.form.autoSyncFormValidity();


    const currentData: any = this.getCurrentStepData();

    console.log(currentData)

    // รองรับทั้ง Create และ Edit Mode
    if (currentData) {
      const menuData = currentData;

      // โหลดข้อมูลลงในฟอร์ม
      if (menuData.type) this.form?.get('type')?.setValue(menuData.type);
      if (menuData.sub_type) this.form?.get('sub_type')?.setValue(menuData.sub_type);
      if (menuData.name) this.form?.get('name')?.setValue(menuData.name);
      if (menuData.is_active !== undefined) this.form?.get('is_active')?.setValue(menuData.is_active);

      // แสดงรูปภาพ - รองรับทั้ง File object, base64, และ URL
      if (menuData.imageFile && menuData.imageFile instanceof File) {
          // กรณีมี File object - ให้สร้าง Object URL ใหม่เสมอเพื่อความชัวร์
          console.log('🔄 Creating Object URL from File...', menuData.imageFile);

          this.form?.get('imageFile')?.setValue(menuData.imageFile);
          this.form?.get('imageFile')?.clearValidators();
          this.form?.get('imageFile')?.updateValueAndValidity();

          const url = FileHelper.createObjectURL(menuData.imageFile);
          this.objectUrls.push(url);
          this.imageDisplay = url;

      } else if (menuData.imageDisplay) {
         // Fallback กรณีไม่มี File แต่มี string (เช่น base64 เก่า หรือ URL จาก backend)
        this.imageDisplay = menuData.imageDisplay;
        this.form?.get('imageFile')?.setValue(menuData.imageFile || 'existing');
        this.form?.get('imageFile')?.clearValidators();
        this.form?.get('imageFile')?.updateValueAndValidity();

        console.log('✅ Loaded existing image from imageDisplay');
      } else {
        // กรณี Create: ยังไม่มีรูป - ต้องอัปโหลดใหม่
        this.form?.get('imageFile')?.setValidators([Validators.required]);
        this.form?.get('imageFile')?.updateValueAndValidity();

        console.log('📝 Create mode - waiting for image upload');
      }

      // บังคับให้ Angular อัพเดท view
      this.cdr.detectChanges();
    }
  }

  get f() {
    return this.form?.controls;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file) {
      console.log('📁 File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified)
      });

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('❌ Invalid file type:', file.type);
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('❌ File too large:', file.size);
        alert('ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า');
        return;
      }

      // Set file to form control
      this.form?.get('imageFile')?.setValue(file);
      this.form?.get('imageFile')?.markAsTouched();

      // Create preview using Object URL (RAM efficient)
      const url = FileHelper.createObjectURL(file);
      this.objectUrls.push(url);
      this.imageDisplay = url;

      // อัพเดท step data
      // หมายเหตุ: เราเก็บ imageDisplay เป็น url ซึ่งอาจจะเป็น blob url
      // แต่เรามี imageFile เป็น File Object อยู่แล้ว ซึ่งสำคัญกว่า
      this.updateStepData({
        ...this.form?.value,
        imageDisplay: this.imageDisplay
      });

      this.cdr.detectChanges();
      console.log('✅ New image preview created (Object URL)');

    } else {
      console.log('⚠️ No file selected');
    }
  }

  // เพิ่ม method เพื่อตรวจสอบการโหลดรูป
  onImageLoad(): void {
    console.log('✅ Image loaded successfully in DOM');
  }

  onImageError(event: Event): void {
    console.error('❌ Image failed to load in DOM:', event);
    console.error('❌ Current imageDisplay value:', this.imageDisplay);
  }

  // Method to clear image
  clearImage(): void {
    this.imageDisplay = null;
    this.form?.get('imageFile')?.setValue(null);
    this.form?.get('imageFile')?.markAsTouched();

    // อัพเดท step data
    this.updateStepData({
      ...this.form?.value,
      imageDisplay: null
    });
  }

  // Helper method เพื่ออัพเดท step data
  private updateStepData(data: any): void {
    // ใช้ helper หรือ workflowStep service เพื่อบันทึกข้อมูล
    // ปรับตามโครงสร้างของโปรเจ็กต์
    if (this.helper) {
      // ตัวอย่างการบันทึกข้อมูล
      // this.helper.updateData(data);
    }
  }

}
