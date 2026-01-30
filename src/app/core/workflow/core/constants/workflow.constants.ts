export const NODE_TYPES = {
  TASK: 'task',
  END: 'end',
  WORKFLOW_IN_PAGE: 'workflow-in-page'
} as const



export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
