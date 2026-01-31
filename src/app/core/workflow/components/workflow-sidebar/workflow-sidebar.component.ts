import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from "@ionic/angular/standalone";
import { WorkflowStepDefinition } from '@core/workflow';

@Component({
  selector: 'app-workflow-sidebar',
  templateUrl: './workflow-sidebar.component.html',
  styleUrls: ['./workflow-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class WorkflowSidebarComponent {
  @Input() steps: WorkflowStepDefinition[] = [];
  @Input() currentIndex = 0;
  @Input() cancelLabel? = '';


  /**
   * ตรวจสอบว่า step เสร็จสิ้นหรือยัง
   */
  isStepCompleted(index: number): boolean {
    return index < this.currentIndex;
  }

  /**
   * ตรวจสอบว่า step กำลัง active หรือไม่
   */
  isStepActive(index: number): boolean {
    return index === this.currentIndex;
  }


}
