import type { Plugin } from '../models/plugin.ts';
import type { Task } from '../models/task.ts';

export type RunOptions = {
  model: string;
  plugins?: Array<Plugin>;
  tasks?: Array<Task>;
};
