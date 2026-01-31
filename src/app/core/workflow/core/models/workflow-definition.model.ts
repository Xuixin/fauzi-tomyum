// src/app/workflow/core/models/workflow-definition.model.ts

import { Type } from '@angular/core';

/**
 * Workflow Definition
 * กำหนดโครงสร้างและขั้นตอนทั้งหมดของ workflow
 */
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  ui: WorkflowUIConfig;
  steps: WorkflowStepDefinition[];
}

/**
 * Workflow UI Configuration
 * กำหนดการแสดงผล UI ของ workflow
 */
export interface WorkflowUIConfig {
  headerLabel: string;
  cancelLabel?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  showCancelButtonHeader?: boolean;
}

/**
 * Workflow Step Definition
 * กำหนดแต่ละ step ใน workflow
 */
export interface WorkflowStepDefinition {
  id: string;
  name: string;
  description?: string;
  component: Type<any>;
  icon?: string;
  validators?: any[];
  validation?: {
    required?: boolean;
    modal?: Type<any>;
  };
  nextButton?: {
    label?: string;
    icon?: string;
    color?: string;
  };
  backButton?: {
    label?: string;
    icon?: string;
  };
}

/**
 * Workflow State
 * เก็บสถานะปัจจุบันของ workflow
 */
export interface WorkflowState {
  definition: WorkflowDefinition;
  currentStepId: string;
  currentIndex: number;
  totalSteps: number;
  progress: number;
  isValid: boolean;
  canGoNext: boolean;
  canGoBack: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  data: Record<string, any>;
}

/**
 * Workflow Options
 * ตัวเลือกเมื่อเปิด workflow
 */
export interface WorkflowOptions {
  initialData?: any;
  cssClass?: string | string[];
  backdropDismiss?: boolean;
}

/**
 * Workflow Result
 * ผลลัพธ์เมื่อ workflow เสร็จสิ้น
 */
export interface WorkflowResult<T = any> {
  cancelled: boolean;
  data?: T;
  stepId?: string;
}

/**
 * Workflow Callbacks
 * Callback functions สำหรับ workflow events
 */
export interface WorkflowCallbacks<T = any> {
  onComplete?: (data: T) => void;
  onCancel?: () => void;
  onStepChange?: (stepId: string, stepIndex: number) => void;
}
