// src/app/workflow/core/models/workflow-state.model.ts

/**
 * Workflow Step State
 * สถานะของแต่ละ step
 */
export interface WorkflowStepState {
  id: string;
  index: number;
  name: string;
  isCompleted: boolean;
  isActive: boolean;
  isValid: boolean;
  data: any;
}

/**
 * Workflow Navigation State
 * สถานะการนำทาง
 */
export interface WorkflowNavigationState {
  canGoNext: boolean;
  canGoBack: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Workflow Validation State
 * สถานะการ validate
 */
export interface WorkflowValidationState {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}
