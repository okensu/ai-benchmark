import type { RunResult } from '../core/models/run-result.ts';
import type { Task } from '../core/models/task.ts';
import type { Test } from '../core/models/test.ts';
import type { Workflow } from '../core/models/workflow.ts';

export type DefaultWorkflowOptions = {
  implement: (instructions: string) => void | Promise<void>;
  test: (test: Test) => void | Promise<void>;
  fix: (instructions: string) => void | Promise<void>;
};

export class DefaultWorkflow implements Workflow {
  private implement: (instructions: string) => void | Promise<void>;
  private test: (test: Test) => void | Promise<void>;
  private fix: (instructions: string) => void | Promise<void>;

  constructor(options: DefaultWorkflowOptions) {
    this.implement = options.implement;
    this.test = options.test;
    this.fix = options.fix;
  }

  // TODO: Pass tasks and event bus instead of result?
  public async run(result: RunResult): Promise<void> {
    for (const task of result.tasks) {
      await this.runTask(task, result);
    }
  }

  // TODO: Get rid of recursion
  public async runTask(task: Task, result: RunResult): Promise<void> {
    if (task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        await this.runTask(subtask, result);
      }
    } else {
      await this.implement(task.instructions);

      // TODO: Process different types of tests
      for (const test of task.tests) {
        await this.test(test);
      }

      // TODO: Prepare instructions
      const fixInstructions = '';

      await this.fix(fixInstructions);
    }
  }
}
