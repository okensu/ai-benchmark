import type { EventEmitter } from 'node:events';
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

  public async run(tasks: Array<Task>, emitter: EventEmitter): Promise<void> {
    for (const task of tasks) {
      await this.runTask(task, emitter);
    }
  }

  // TODO: Get rid of recursion
  public async runTask(task: Task, emitter: EventEmitter): Promise<void> {
    if (task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        await this.runTask(subtask, emitter);
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
