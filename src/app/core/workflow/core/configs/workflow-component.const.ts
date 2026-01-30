import { Type } from "@angular/core";

export type WorkflowComponentMap = Record<
  string,
  Type<any> | (() => Promise<any>)
>;

export const CORE_WORKFLOW_COMPONENT_MAP: WorkflowComponentMap = {
  
}
