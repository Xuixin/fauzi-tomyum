import { APP_INITIALIZER, Provider } from '@angular/core';
import { WorkflowRegistryService } from './core/services/workflow-registry';
import { WorkflowFacade } from './core/services/workflow-facade.service';
import { WORKFLOW_DEFINITIONS } from './definitions';
import { WorkflowEngineService } from './core/services/workflow-engine';

export function provideWorkflow(): Provider[] {
  return [
    WorkflowFacade,
    WorkflowRegistryService,
    WorkflowEngineService,
    {
      provide: APP_INITIALIZER,
      useFactory: (registry: WorkflowRegistryService) => {
        return () => {
          // Auto-register all workflows when app starts
          registry.registerAll(WORKFLOW_DEFINITIONS);
          console.log(`✅ Registered ${WORKFLOW_DEFINITIONS.length} workflows`);
        };
      },
      deps: [WorkflowRegistryService],
      multi: true,
    },
  ];
}
