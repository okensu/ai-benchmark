import type { Plugin } from '../models/plugin.ts';
import type { Task } from '../models/task.ts';
import type { Workflow } from '../models/workflow.ts';

export type RunOptions = {
  model: string;
  workflow: Workflow;
  plugins?: Array<Plugin>;
  tasks?: Array<Task>;
};
