// src/app/workflow/core/base/base-step.component.ts

import { Directive, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ViewChild, TemplateRef, AfterViewInit, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { WorkflowStepService } from './../services/workflow-step';
import { WorkflowStepDefinition } from '../models/workflow-definition.model';

@Directive()
export abstract class BaseStepComponent<T = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // Input data
  @Input() stepData?: T;
  @Input() allStepData?: Record<string, any>;

  @ViewChild('footer') footerTemplate?: TemplateRef<any>;

  // Form instance
  protected form?: FormGroup;

  // Destroy subject สำหรับ unsubscribe
  protected destroy$ = new Subject<void>();


  protected nextLabel = computed(() => {
    const currentStep = this.workflowStep.getCurrentStepConfig()();
    return currentStep?.nextButton?.label || 'ถัดไป';
  });

  constructor(protected workflowStep: WorkflowStepService) {}

  /**
   * Lifecycle: NgOnInit
   */
  ngOnInit(): void {
    // 1. Build form
    this.form = this.buildForm();

    // 2. Setup auto-save และ validation
    this.setupFormValidation();

    // 3. Load initial data
    this.loadInitialData();

    // 4. เรียก custom init
    this.init();
  }

  ngAfterViewInit(): void {
    if (this.footerTemplate) {
      setTimeout(() => {
        this.workflowStep.setFooter(this.footerTemplate!);
      });
    }
  }

  /**
   * Lifecycle: NgOnChanges
   * Reload data when inputs change (เช่นเมื่อกลับมาที่ step นี้)
   */
  ngOnChanges(changes: SimpleChanges): void {
    // ถ้า form ถูกสร้างแล้วและ stepData เปลี่ยน
    if (this.form && changes['stepData'] && !changes['stepData'].firstChange) {
      this.loadInitialData();
    }
  }

  /**
   * Abstract method: ต้อง implement เพื่อสร้างฟอร์ม
   */
  protected abstract buildForm(): FormGroup;

  /**
   * Override method: สำหรับ custom initialization
   */
  protected init(): void {
    // Override in child class if needed
  }

  /**
   * Setup auto-save และ validation
   */
  private setupFormValidation(): void {
    if (!this.form) return;

    // Auto-save เมื่อ form เปลี่ยนแปลง
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.workflowStep.saveData(value);
        this.workflowStep.setValid(this.form!.valid);
      });

    // ตั้งค่า initial validation
    this.workflowStep.setValid(this.form.valid);
  }

  /**
   * โหลดข้อมูลเริ่มต้นเข้าฟอร์ม
   */
  private loadInitialData(): void {
    if (!this.form) return;

    // ลองดึงข้อมูลจาก @Input ก่อน
    let dataToLoad: any = this.stepData;

    // ถ้าไม่มี ให้ลองดึงจาก workflow engine
    if (!dataToLoad) {
      const currentState = this.workflowStep.getState$();
      // Get current step data from engine
      dataToLoad = this.workflowStep.getStepData(
        this.getCurrentStepId()
      );
    }

    // Patch ข้อมูลเข้าฟอร์ม
    if (dataToLoad && typeof dataToLoad === 'object') {
      this.form.patchValue(dataToLoad, { emitEvent: false });

      for (const controlName in dataToLoad) {

      }


      // Trigger validation หลัง patch
      this.workflowStep.setValid(this.form.valid);
    }
  }

  /**
   * Get current step ID from workflow state
   */
  private getCurrentStepId(): string {
    let currentStepId = '';
    this.workflowStep.getState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state) {
          currentStepId = state.currentStepId;
        }
      });
    return currentStepId;
  }

  /**
   * Helper: ไปขั้นตอนถัดไป
   *
   * @example
   * async onSubmit() {
   *   await this.goNext({ extraField: 'value' });
   * }
   */
  protected async goNext(additionalData?: any): Promise<void> {
    if (!this.form?.valid) {
      this.markFormAsTouched();
      return;
    }

    // เรียก beforeNext hook
    const canProceed = await this.beforeNext();
    if (!canProceed) {
      return;
    }

    console.log('✅ Proceed to next step');
    console.log(canProceed);

    // ไปขั้นตอนถัดไป

    console.log("call next")
    this.workflowStep.next(additionalData);
  }

  /**
   * Helper: กลับไปขั้นตอนก่อนหน้า
   */
  protected goBack(): void {
    this.workflowStep.back();
  }

  /**
   * Helper: ไปยังขั้นตอนที่กำหนด
   */
  protected goToStep(stepId: string): void {
    this.workflowStep.goToStep(stepId);
  }

  /**
   * Override method: Hook ก่อนไปขั้นตอนถัดไป
   * Return false เพื่อป้องกันการไปขั้นตอนถัดไป
   *
   * @example
   * protected async beforeNext(): Promise<boolean> {
   *   const confirmed = await this.showConfirmDialog();
   *   return confirmed;
   * }
   */
  protected async beforeNext(): Promise<boolean> {
    return true;
  }

  /**
   * Helper: ดึงข้อมูลจาก step อื่น
   *
   * @example
   * const userInfo = this.getStepData<UserInfo>('step-user-info');
   */
  protected getStepData<TData = any>(stepId: string): TData | null {
    return this.allStepData?.[stepId] ?? this.workflowStep.getStepData<TData>(stepId);
  }


  protected getCurrentStepData(): Record<string, any> | null {
    return this.workflowStep.getStepData(this.getCurrentStepId());
  }




  /**
   * Helper: ดึงข้อมูลทั้งหมดของ workflow
   */
  protected getAllData(): Record<string, any> {
    return this.workflowStep.getAllData();
  }

  /**
   * Helper: Mark all fields as touched (แสดง error)
   */
  protected markFormAsTouched(): void {
    if (this.form) {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Helper: Reset form
   */
  protected resetForm(value?: any): void {
    if (this.form) {
      this.form.reset(value);
    }
  }

  /**
   * Helper: บันทึกข้อมูลทันที (ไม่ต้องรอ debounce)
   */
  protected saveDataNow(data?: any): void {
    const dataToSave = data || this.form?.value;
    this.workflowStep.saveData(dataToSave);
  }

  /**
   * Helper: ตั้งค่า canGoNext
   */
  protected setCanGoNext(canGoNext: boolean): void {
    this.workflowStep.setCanGoNext(canGoNext);
  }

  /**
   * Helper: ปิด workflow
   */

  /**
   * Lifecycle: NgOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
