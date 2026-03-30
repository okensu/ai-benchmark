import type { RunResultOptions } from '../types/run-result-options.ts';
import type { Plugin } from './plugin.ts';
import type { Task } from './task.ts';

export class RunResult {
  public model: string;
  public plugins: Array<Plugin>;
  public tasks: Array<Task>;

  constructor(options: RunResultOptions) {
    this.model = options.model;
    this.plugins = options.plugins;
    this.tasks = options.tasks;
  }
}
