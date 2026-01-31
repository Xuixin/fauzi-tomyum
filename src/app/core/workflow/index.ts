// src/app/workflow/index.ts
// Public API - Export only what others should use

// Module
// export * from './workflow-module'; // Deleted

// Main Facade (primary API)
export * from './core/services/workflow-facade.service';

// Base Component (for creating custom steps)
export * from './core/base/base-step.component';

// Models (for TypeScript support)
export * from './core/models/workflow-definition.model';
export * from './core/models/workflow-state.model';

// Definitions (for reference)
export * from './definitions';

// Don't export:
// - Internal services (WorkflowEngine, WorkflowRegistry, WorkflowStepService)
// - Internal components (Container, Sidebar, etc.)
// - Step components (they're implementation details)