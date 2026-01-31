// src/app/workflow/definitions/index.ts

import { WorkflowDefinition } from '../core/models/workflow-definition.model';
import { CreateMenuWorkflow } from './create-menu.workflow';
import { ExampleWorkflow } from './example-workflow';

/**
 * Export all workflow definitions
 */
export * from './example-workflow';

/**
 * Array of all workflows for bulk registration
 */
export const WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  ExampleWorkflow,
  CreateMenuWorkflow
  // เพิ่ม workflows อื่นๆ ตรงนี้
  // CreateCodeWorkflow,
  // CreateAdminWorkflow,
  // ImportProductWorkflow,
];