import { DefaultWorkflow } from '../../workflows/default.ts';
import type { Workflow } from '../models/workflow.ts';

export function defaultWorkflow(): Workflow {
  return new DefaultWorkflow();
}
