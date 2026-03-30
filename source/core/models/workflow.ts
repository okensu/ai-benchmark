import type { RunResult } from './run-result.ts';

export abstract class Workflow {
  public abstract run(result: RunResult): void | Promise<void>;
}
