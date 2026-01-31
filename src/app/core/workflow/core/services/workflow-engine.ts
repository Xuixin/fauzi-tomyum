// src/app/workflow/core/services/workflow-engine.service.ts

import { Injectable, signal, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WorkflowDefinition, WorkflowState, WorkflowStepDefinition } from '../models/workflow-definition.model';

/**
 * Workflow Engine Service
 * จัดการ state และ logic การทำงานของ workflow
 */
@Injectable()
export class WorkflowEngineService {
  private stateSubject = new BehaviorSubject<WorkflowState | null>(null);
  public state$ = this.stateSubject.asObservable();

  // Footer Template Management
  private footerTemplateSubject = new BehaviorSubject<TemplateRef<any> | null>(null);
  public footerTemplate$ = this.footerTemplateSubject.asObservable();

  public currentStepConfig = signal<WorkflowStepDefinition | null>(null);
  private currentDefinition!: WorkflowDefinition;
  private currentStepIndex = 0;
  private stepData: Record<string, any> = {};
  private stepValidityMap: Map<string, boolean> = new Map();

  /**
   * เริ่มต้น workflow ด้วย definition
   */
  initialize(definition: WorkflowDefinition, initialData?: any): void {
    this.currentDefinition = definition;
    this.currentStepIndex = 0;
    this.stepData = initialData || {};
    this.stepValidityMap.clear();

    // Set initial validity for all steps
    definition.steps.forEach(step => {
      this.stepValidityMap.set(step.id, false);
    });

    this.updateState();
  }

  /**
   * ไปขั้นตอนถัดไป
   */
  goNext(additionalData?: any): void {
    if (!this.canGoNext()) {
      console.warn('Cannot go to next step');
      return;
    }

    // Save additional data if provided
    if (additionalData) {
      const currentStepId = this.getCurrentStepId();
      this.stepData[currentStepId] = {
        ...this.stepData[currentStepId],
        ...additionalData
      };
    }

    this.currentStepIndex++;
    this.updateState();
  }

  /**
   * กลับขั้นตอนก่อนหน้า
   */
  goBack(): void {
    if (!this.canGoBack()) {
      console.warn('Cannot go back');
      return;
    }

    this.currentStepIndex--;
    this.updateState();
  }

  /**
   * ไปยังขั้นตอนที่กำหนด
   */
  goToStep(stepId: string): void {
    const stepIndex = this.currentDefinition.steps.findIndex(s => s.id === stepId);

    if (stepIndex === -1) {
      console.warn(`Step '${stepId}' not found`);
      return;
    }

    this.currentStepIndex = stepIndex;
    this.updateState();
  }

  /**
   * บันทึกข้อมูลของ step ปัจจุบัน
   */
  saveCurrentStepData(data: any): void {
    const currentStepId = this.getCurrentStepId();
    this.stepData[currentStepId] = data;
    this.updateState();
  }

  /**
   * ตั้งค่าความถูกต้องของ step ปัจจุบัน
   */
  setStepValid(isValid: boolean): void {
    const currentStepId = this.getCurrentStepId();
    this.stepValidityMap.set(currentStepId, isValid);
    this.updateState();
  }

  /**
   * ดึงข้อมูลของ step ที่กำหนด
   */
  getStepData(stepId: string): any {
    return this.stepData[stepId];
  }

  /**
   * ดึงข้อมูลทั้งหมด
   */
  getAllData(): Record<string, any> {
    return { ...this.stepData };
  }

  /**
   * ตรวจสอบว่าสามารถไปขั้นตอนถัดไปได้หรือไม่
   */
  private canGoNext(): boolean {
    if (this.isLastStep()) {
      return true;
    }

    const currentStepId = this.getCurrentStepId();
    return this.stepValidityMap.get(currentStepId) || false;
  }

  /**
   * ตรวจสอบว่าสามารถกลับได้หรือไม่
   */
  private canGoBack(): boolean {
    return this.currentStepIndex > 0;
  }

  /**
   * ตรวจสอบว่าเป็น step แรกหรือไม่
   */
  private isFirstStep(): boolean {
    return this.currentStepIndex === 0;
  }

  /**
   * ตรวจสอบว่าเป็น step สุดท้ายหรือไม่
   */
  private isLastStep(): boolean {
    return this.currentStepIndex === this.currentDefinition.steps.length - 1;
  }

  /**
   * คำนวณ progress percentage
   */
  private calculateProgress(): number {
    const total = this.currentDefinition.steps.length;
    return Math.round(((this.currentStepIndex + 1) / total) * 100);
  }

  /**
   *    set can go next
   */
  setCanGoNext(canGoNext: boolean): void {
    const currentState = this.stateSubject.getValue();
    if (!currentState) {
      return;
    }
    const state: WorkflowState = {
      ...currentState,
      canGoNext: canGoNext
    };
    this.stateSubject.next(state);
  }


  /**
   * ดึง step ID ปัจจุบัน
   */
  private getCurrentStepId(): string {
    return this.currentDefinition.steps[this.currentStepIndex].id;
  }

  /**
   * อัพเดท state
   */
  private updateState(): void {
    const currentStepId = this.getCurrentStepId();
    const isValid = this.stepValidityMap.get(currentStepId) || false;

    this.currentStepConfig.set(this.currentDefinition.steps[this.currentStepIndex]);
    const state: WorkflowState = {
      definition: this.currentDefinition,
      currentStepId,
      currentIndex: this.currentStepIndex,
      totalSteps: this.currentDefinition.steps.length,
      progress: this.calculateProgress(),
      isValid,
      canGoNext: this.canGoNext(),
      canGoBack: this.canGoBack(),
      isFirstStep: this.isFirstStep(),
      isLastStep: this.isLastStep(),
      data: this.getAllData()
    };

    this.stateSubject.next(state);
  }

  /**
   * รีเซ็ต workflow
   */
  reset(): void {
    this.currentStepIndex = 0;
    this.stepData = {};
    this.stepValidityMap.clear();
    this.updateState();
  }

  /**
   * Set the footer template for the current step
   */
  setFooterTemplate(template: TemplateRef<any> | null): void {
    this.footerTemplateSubject.next(template);
  }

  /**
   * ทำลาย service
   */
  destroy(): void {
    this.stateSubject.complete();
    this.footerTemplateSubject.complete();
  }
}
