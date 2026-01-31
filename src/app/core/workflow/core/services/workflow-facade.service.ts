// src/app/workflow/core/services/workflow-facade.service.ts

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WorkflowRegistryService } from './workflow-registry';
import {
  WorkflowOptions,
  WorkflowResult,
  WorkflowCallbacks
} from '../models/workflow-definition.model';
import { WorkflowContainerComponent } from '../../components/workflow-container/workflow-container.component';

/**
 * Workflow Facade Service
 * Main API สำหรับเรียกใช้งาน workflows
 */
@Injectable({
  providedIn: 'root'
})
export class WorkflowFacade {
  constructor(
    private modalController: ModalController,
    private workflowRegistry: WorkflowRegistryService
  ) { }

  /**
   * เปิด workflow แบบ async/await
   *
   * @example
   * const result = await this.workflowFacade.startWorkflow('create-user');
   * if (!result.cancelled) {
   *   console.log('User created:', result.data);
   * }
   */
  async startWorkflow<T = any>(
    workflowId: string,
    options?: WorkflowOptions
  ): Promise<WorkflowResult<T>> {
    // ตรวจสอบว่ามี workflow อยู่หรือไม่
    const workflow = this.workflowRegistry.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found. Please register it first.`);
    }

    // สร้าง modal
    const modal = await this.modalController.create({
      component: WorkflowContainerComponent,
      componentProps: {
        workflowId,
        initialData: options?.initialData,
      },
      cssClass: this.buildCssClass(options?.cssClass),
      backdropDismiss: options?.backdropDismiss ?? true,
      showBackdrop: true,
    });

    // เปิด modal
    await modal.present();

    // รอ modal ปิด
    const { data } = await modal.onDidDismiss<WorkflowResult<T>>();

    return data || { cancelled: true };
  }

  /**
   * เปิด workflow พร้อม callbacks
   *
   * @example
   * await this.workflowFacade.startWorkflowWithCallback(
   *   'create-user',
   *   {
   *     onComplete: (data) => console.log('Done:', data),
   *     onCancel: () => console.log('Cancelled')
   *   }
   * );
   */
  async startWorkflowWithCallback<T = any>(
    workflowId: string,
    callbacks: WorkflowCallbacks<T>,
    options?: WorkflowOptions
  ): Promise<void> {
    const result = await this.startWorkflow<T>(workflowId, options);

    if (result.cancelled && callbacks.onCancel) {
      callbacks.onCancel();
    } else if (!result.cancelled && callbacks.onComplete && result.data) {
      callbacks.onComplete(result.data);
    }
  }

  /**
   * สร้าง CSS class สำหรับ modal
   */
  private buildCssClass(
    customClass?: string | string[],
  ): string | string[] {
    const classes: string[] = ['modal-ninety'];

    // เพิ่ม custom classes
    if (customClass) {
      if (Array.isArray(customClass)) {
        classes.push(...customClass);
      } else {
        classes.push(customClass);
      }
    }

    return classes;
  }

  /**
   * ปิด modal ที่เปิดอยู่
   */
  async dismissCurrentWorkflow(data?: any): Promise<void> {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss(data);
    }
  }
}
