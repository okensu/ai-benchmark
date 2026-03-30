import { DefaultWorkflow } from '../../workflows/default.ts';
import type { Workflow } from '../models/workflow.ts';
import type { DefaultWorkflowOptions } from '../types/default-workflow-options.ts';

export function defaultWorkflow(options: DefaultWorkflowOptions): Workflow {
  return new DefaultWorkflow({
    implement: options.implement,
    test: options.test,
    fix: options.fix
  });
}
