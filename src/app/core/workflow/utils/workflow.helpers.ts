// src/app/workflow/utils/workflow.helpers.ts

import { FormGroup } from '@angular/forms';
import { WorkflowStepService } from '../core/services/workflow-step';

/**
 * Workflow Navigation Helpers
 * ช่วยจัดการการนำทางและควบคุม canGoNext
 */
export class WorkflowNavigationHelper {
    constructor(private workflowStep: WorkflowStepService) { }

    /**
     * เปิดใช้งานปุ่ม Next
     */
    enableNext(): void {
        this.workflowStep.setCanGoNext(true);
    }

    /**
     * ปิดใช้งานปุ่ม Next
     */
    disableNext(): void {
        this.workflowStep.setCanGoNext(false);
    }

    /**
     * Toggle ปุ่ม Next
     */
    toggleNext(enabled: boolean): void {
        this.workflowStep.setCanGoNext(enabled);
    }

    /**
     * เปิดใช้งานปุ่ม Next ตามเงื่อนไข
     * 
     * @example
     * helper.enableNextIf(form.valid && dataLoaded);
     */
    enableNextIf(condition: boolean): void {
        this.workflowStep.setCanGoNext(condition);
    }

    /**
     * เปิดใช้งานปุ่ม Next ตามหลายเงื่อนไข (AND)
     * 
     * @example
     * helper.enableNextIfAll([
     *   form.valid,
     *   imageUploaded,
     *   termsAccepted
     * ]);
     */
    enableNextIfAll(conditions: boolean[]): void {
        const allTrue = conditions.every(c => c === true);
        this.workflowStep.setCanGoNext(allTrue);
    }

    /**
     * เปิดใช้งานปุ่ม Next ถ้ามีเงื่อนไขใดเงื่อนไขหนึ่งเป็นจริง (OR)
     * 
     * @example
     * helper.enableNextIfAny([
     *   uploadedFile,
     *   skipUpload
     * ]);
     */
    enableNextIfAny(conditions: boolean[]): void {
        const anyTrue = conditions.some(c => c === true);
        this.workflowStep.setCanGoNext(anyTrue);
    }
}

/**
 * Form Validation Helpers
 * ช่วยจัดการการ validate ฟอร์ม
 */
export class WorkflowFormHelper {
    constructor(
        private workflowStep: WorkflowStepService,
        private form?: FormGroup
    ) { }

    /**
     * Auto sync form validity กับ canGoNext
     * 
     * @example
     * const helper = new WorkflowFormHelper(workflowStep, form);
     * helper.autoSyncFormValidity();
     */
    autoSyncFormValidity(): void {
        if (!this.form) {
            console.warn('Form is not provided');
            return;
        }

        // Initial sync
        this.workflowStep.setCanGoNext(this.form.valid);

        // Subscribe to changes
        this.form.statusChanges.subscribe(() => {
            this.workflowStep.setCanGoNext(this.form!.valid);
        });
    }

    /**
     * Auto sync form validity พร้อมเงื่อนไขเพิ่มเติม
     * 
     * @example
     * helper.autoSyncFormValidityWith(() => imageUploaded);
     */
    autoSyncFormValidityWith(additionalCondition: () => boolean): void {
        if (!this.form) {
            console.warn('Form is not provided');
            return;
        }

        const checkValidity = () => {
            const isValid = this.form!.valid && additionalCondition();
            this.workflowStep.setCanGoNext(isValid);
        };

        // Initial check
        checkValidity();

        // Subscribe to changes
        this.form.statusChanges.subscribe(() => checkValidity());
    }

    /**
     * Mark form as touched และแสดง error
     */
    showAllErrors(): void {
        if (this.form) {
            this.form.markAllAsTouched();
        }
    }

    /**
     * ตรวจสอบว่าฟอร์มมี error หรือไม่
     */
    hasErrors(): boolean {
        return this.form ? this.form.invalid : false;
    }

    /**
     * Get all form errors
     */
    getAllErrors(): Record<string, any> {
        if (!this.form) return {};

        const errors: Record<string, any> = {};
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form!.get(key);
            if (control && control.errors) {
                errors[key] = control.errors;
            }
        });

        return errors;
    }
}

/**
 * Data Management Helpers
 * ช่วยจัดการข้อมูลระหว่าง steps
 */
export class WorkflowDataHelper {
    constructor(private workflowStep: WorkflowStepService) { }

    /**
     * ดึงข้อมูลจาก step ก่อนหน้า
     * 
     * @example
     * const userInfo = helper.getPreviousStepData('user-info');
     */
    getPreviousStepData<T = any>(stepId: string): T | null {
        return this.workflowStep.getStepData<T>(stepId);
    }

    /**
     * ดึงข้อมูลทั้งหมด
     */
    getAllData(): Record<string, any> {
        return this.workflowStep.getAllData();
    }

    /**
     * บันทึกข้อมูลเพิ่มเติม
     */
    saveAdditionalData(data: any): void {
        this.workflowStep.saveData(data);
    }

    /**
     * รวมข้อมูลจากหลาย steps
     * 
     * @example
     * const combined = helper.mergeStepsData(['step-1', 'step-2', 'step-3']);
     */
    mergeStepsData(stepIds: string[]): Record<string, any> {
        const allData = this.getAllData();
        const merged: Record<string, any> = {};

        stepIds.forEach(stepId => {
            if (allData[stepId]) {
                Object.assign(merged, allData[stepId]);
            }
        });

        return merged;
    }

    /**
     * ตรวจสอบว่า step มีข้อมูลหรือไม่
     */
    hasStepData(stepId: string): boolean {
        const data = this.workflowStep.getStepData(stepId);
        return data !== null && data !== undefined;
    }

    /**
     * ดึงข้อมูลหลาย fields จาก step เดียว
     * 
     * @example
     * const [name, email] = helper.getStepFields('user-info', ['name', 'email']);
     */
    getStepFields<T = any>(stepId: string, fields: string[]): (T | undefined)[] {
        const stepData = this.workflowStep.getStepData(stepId);
        if (!stepData) return fields.map(() => undefined);

        return fields.map(field => stepData[field]);
    }
}

/**
 * Conditional Navigation Helper
 * ช่วยจัดการการนำทางแบบมีเงื่อนไข
 */
export class WorkflowConditionalHelper {
    constructor(private workflowStep: WorkflowStepService) { }

    /**
     * ไปยัง step ที่กำหนดตามเงื่อนไข
     * 
     * @example
     * helper.goToStepIf(
     *   () => userType === 'admin',
     *   'admin-settings',
     *   'user-settings'
     * );
     */
    goToStepIf(
        condition: () => boolean,
        stepIdIfTrue: string,
        stepIdIfFalse?: string
    ): void {
        if (condition()) {
            this.workflowStep.goToStep(stepIdIfTrue);
        } else if (stepIdIfFalse) {
            this.workflowStep.goToStep(stepIdIfFalse);
        }
    }

    /**
     * ข้ามไปยัง step ถัดไปตามเงื่อนไข
     */
    skipNextStepIf(condition: () => boolean, targetStepId: string): void {
        if (condition()) {
            this.workflowStep.goToStep(targetStepId);
        } else {
            this.workflowStep.next();
        }
    }
}

/**
 * Async Operation Helper
 * ช่วยจัดการ async operations และ loading states
 */
export class WorkflowAsyncHelper {
    private isLoading = false;

    constructor(private workflowStep: WorkflowStepService) { }

    /**
     * Execute async operation และปิด canGoNext ระหว่างโหลด
     * 
     * @example
     * await helper.withLoading(async () => {
     *   await uploadFile();
     *   await saveData();
     * });
     */
    async withLoading<T>(
        operation: () => Promise<T>,
        options?: {
            disableNextWhileLoading?: boolean;
            onSuccess?: (result: T) => void;
            onError?: (error: any) => void;
        }
    ): Promise<T | null> {
        const {
            disableNextWhileLoading = true,
            onSuccess,
            onError
        } = options || {};

        try {
            this.isLoading = true;

            if (disableNextWhileLoading) {
                this.workflowStep.setCanGoNext(false);
            }

            const result = await operation();

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (error) {
            console.error('Async operation failed:', error);

            if (onError) {
                onError(error);
            }

            return null;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * ตรวจสอบสถานะ loading
     */
    getLoadingState(): boolean {
        return this.isLoading;
    }
}

/**
 * Composite Helper
 * รวม helpers ทั้งหมดไว้ในที่เดียว
 */
export class WorkflowHelper {
    public navigation: WorkflowNavigationHelper;
    public form: WorkflowFormHelper;
    public data: WorkflowDataHelper;
    public conditional: WorkflowConditionalHelper;
    public async: WorkflowAsyncHelper;

    constructor(workflowStep: WorkflowStepService, form?: FormGroup) {
        this.navigation = new WorkflowNavigationHelper(workflowStep);
        this.form = new WorkflowFormHelper(workflowStep, form);
        this.data = new WorkflowDataHelper(workflowStep);
        this.conditional = new WorkflowConditionalHelper(workflowStep);
        this.async = new WorkflowAsyncHelper(workflowStep);
    }

    /**
     * สร้าง helper instance
     * 
     * @example
     * const helper = WorkflowHelper.create(workflowStep, form);
     * helper.navigation.enableNext();
     * helper.form.autoSyncFormValidity();
     */
    static create(workflowStep: WorkflowStepService, form?: FormGroup): WorkflowHelper {
        return new WorkflowHelper(workflowStep, form);
    }
}

/**
 * Utility Functions
 */
export const WorkflowUtils = {
    /**
     * Delay execution
     */
    delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    /**
     * Debounce function
     */
    debounce: <T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): ((...args: Parameters<T>) => void) => {
        let timeout: any;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    /**
     * Check if value is empty
     */
    isEmpty: (value: any): boolean => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },

    /**
     * Safe JSON parse
     */
    safeJsonParse: <T = any>(json: string, fallback: T): T => {
        try {
            return JSON.parse(json);
        } catch {
            return fallback;
        }
    }
};