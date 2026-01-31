// src/app/workflow/core/services/workflow-step.service.ts

import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkflowEngineService } from './workflow-engine';

/**
 * Workflow Step Service
 * API สำหรับ step components ในการติดต่อกับ workflow engine
 */
@Injectable()
export class WorkflowStepService {
  constructor(private engine: WorkflowEngineService) {}

  /**
   * บันทึกข้อมูลของ step ปัจจุบัน
   */
  saveData(data: any): void {
    this.engine.saveCurrentStepData(data);
  }

  /**
   * ตั้งค่าความถูกต้องของ step ปัจจุบัน
   */
  setValid(isValid: boolean): void {
    this.engine.setStepValid(isValid);
  }

  /**
   * ตั้งค่า canGoNext
   */
  setCanGoNext(canGoNext: boolean): void {
    this.engine.setCanGoNext(canGoNext);
  }

  /**
   * ไปยังขั้นตอนถัดไป
   */
  next(additionalData?: any): void {
    this.engine.goNext(additionalData);
  }

  /**
   * กลับไปขั้นตอนก่อนหน้า
   */
  back(): void {
    this.engine.goBack();
  }

  /**
   * ไปยังขั้นตอนที่กำหนด
   */
  goToStep(stepId: string): void {
    this.engine.goToStep(stepId);
  }

  /**
   * ดึงข้อมูลทั้งหมดของ workflow
   */
  getAllData(): Record<string, any> {
    return this.engine.getAllData();
  }

  /**
   * ดึงข้อมูลของ step ที่กำหนด
   */
  getStepData<T = any>(stepId: string): T | null {
    return this.engine.getStepData(stepId) ?? null;
  }

  /**
   * รับ state observable
   */
  getState$() {
    return this.engine.state$;
  }

  /**
   * รับ current step config
   */
  getCurrentStepConfig() {
    return this.engine.currentStepConfig;
  }
  /**
   * Set the footer template
   */
  setFooter(template: TemplateRef<any> | null): void {
    this.engine.setFooterTemplate(template);
  }
}
