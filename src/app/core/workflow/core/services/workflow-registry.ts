// src/app/workflow/core/services/workflow-registry.service.ts

import { Injectable } from '@angular/core';
import { WorkflowDefinition } from '../core/models/workflow-definition.model';

/**
 * Workflow Registry Service
 * จัดเก็บและดึง workflow definitions
 */
@Injectable({
  providedIn: 'root'
})
export class WorkflowRegistryService {
  private workflows = new Map<string, WorkflowDefinition>();

  /**
   * ลงทะเบียน workflow definition
   */
  register(definition: WorkflowDefinition): void {
    if (this.workflows.has(definition.id)) {
      console.warn(`Workflow '${definition.id}' is already registered. Overwriting...`);
    }
    this.workflows.set(definition.id, definition);
  }

  /**
   * ลงทะเบียนหลาย workflows พร้อมกัน
   */
  registerAll(definitions: WorkflowDefinition[]): void {
    definitions.forEach(def => this.register(def));
  }

  /**
   * ดึง workflow definition ด้วย ID
   */
  get(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  /**
   * ดึง workflows ทั้งหมด
   */
  getAll(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  /**
   * ตรวจสอบว่ามี workflow อยู่หรือไม่
   */
  has(id: string): boolean {
    return this.workflows.has(id);
  }

  /**
   * ลบ workflow definition
   */
  unregister(id: string): boolean {
    return this.workflows.delete(id);
  }

  /**
   * ลบ workflows ทั้งหมด
   */
  clear(): void {
    this.workflows.clear();
  }

  /**
   * นับจำนวน workflows
   */
  get count(): number {
    return this.workflows.size;
  }
}
