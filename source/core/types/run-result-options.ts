import type { Plugin } from '../models/plugin.ts';
import type { Task } from '../models/task.ts';

export type RunResultOptions = {
  model: string;
  plugins: Array<Plugin>;
  tasks: Array<Task>;
};
