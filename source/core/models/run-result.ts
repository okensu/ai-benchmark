import type { RunResultOptions } from '../types/run-result-options.ts';
import type { Plugin } from './plugin.ts';

export class RunResult {
  public model: string;
  public plugins: Array<Plugin>;

  constructor(options: RunResultOptions) {
    this.model = options.model;
    this.plugins = options.plugins;
  }
}
