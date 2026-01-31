// src/app/workflow/core/tokens/workflow.tokens.ts

import { InjectionToken } from '@angular/core';

/**
 * Injection Token สำหรับ Workflow Step Data
 */
export const WORKFLOW_STEP_DATA = new InjectionToken<any>('WORKFLOW_STEP_DATA');

/**
 * Injection Token สำหรับ All Steps Data
 */
export const WORKFLOW_ALL_DATA = new InjectionToken<Record<string, any>>('WORKFLOW_ALL_DATA');

/**
 * Injection Token สำหรับ Current Step ID
 */
export const WORKFLOW_STEP_ID = new InjectionToken<string>('WORKFLOW_STEP_ID');
