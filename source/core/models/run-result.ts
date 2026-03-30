import { RunResultOptions } from '../types/run-result-options.ts';

export class RunResult {
  public model: string;

  constructor(options: RunResultOptions) {
    this.model = options.model;
  }
}
