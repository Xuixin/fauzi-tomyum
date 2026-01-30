import { Component, OnInit, OnDestroy, Input, Injector, Type, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowRegistryService } from '../../services/workflow-registry';
import { WorkflowEngineService } from '../../core/services/workflow-engine';
import { WorkflowStepService } from '../../core/services/workflow-step';
import { WorkflowDefinition, WorkflowState } from './../../models';


import { WorkflowSidebarComponent } from '../workflow-sidebar/workflow-sidebar.component';

@Component({
  selector: 'app-workflow-container',
  templateUrl: './workflow-container.component.html',
  styleUrls: ['./workflow-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    WorkflowSidebarComponent,
  ],
  providers: [WorkflowEngineService]
})
export class WorkflowContainerComponent implements OnInit, OnDestroy {
  @Input() workflowId!: string;
  @Input() initialData?: any;
  @Input() footerRef?: TemplateRef<any>;
  // Workflow config
  config!: WorkflowDefinition;


  // Current state
  state?: WorkflowState;
  currentStepComponent?: Type<any>;
  stepInjector!: Injector;

  // UI flags
  showHeader = true;
  showSidebar = true;
  showProgress = true;
  showCancelButtonHeader = true;
  showFooter = true;

  private destroy$ = new Subject<void>();

  constructor(
    private engine: WorkflowEngineService,
    private registry: WorkflowRegistryService,
    private injector: Injector,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    // โหลด workflow definition
    const workflow = this.registry.get(this.workflowId);

    if (!workflow) {
      console.error(`Workflow '${this.workflowId}' not found`);
      this.cancel();
      return;
    }

    this.config = workflow;

    // ตั้งค่า UI flags
    this.showSidebar = this.config.ui.showSidebar ?? true;
    this.showCancelButtonHeader = this.config.ui.showCancelButtonHeader ?? true;

    // เริ่มต้น workflow engine
    this.engine.initialize(this.config, this.initialData);

    // Subscribe state changes
    this.engine.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: any) => {
        if (state) {
          this.state = state;
          this.loadStepComponent(state);
        }
      });
  }

  /**
   * โหลด component ของ step ปัจจุบัน
   */
  /**
   * โหลด component ของ step ปัจจุบัน
   */
  private loadStepComponent(state: WorkflowState): void {
    const step = this.config.steps[state.currentIndex];

    // ถ้าเปลี่ยน step ต้องสร้าง injector ใหม่
    const needNewInjector = this.currentStepComponent !== step.component;

    this.currentStepComponent = step.component

    if (needNewInjector || !this.stepInjector) {
      // ดึงข้อมูลของ step ปัจจุบัน
      const stepData = state.data[state.currentStepId];


      // สร้าง custom injector พร้อม WorkflowStepService และ stepData
      this.stepInjector = Injector.create({
        parent: this.injector,
        providers: [
          {
            provide: WorkflowStepService,
            useValue: new WorkflowStepService(this.engine)
          }
        ]
      });
    }
  }


  /**
   * ปุ่ม Cancel
   */
  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss({ cancelled: true });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.engine.destroy();
  }
}
