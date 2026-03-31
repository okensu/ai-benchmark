import type { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { AgenticTest } from '../core/models/agentic-test.ts';
import { DeterministicTest } from '../core/models/deterministic-test.ts';
import type { Task } from '../core/models/task.ts';
import type { Test } from '../core/models/test.ts';
import type { TestResult } from '../core/models/test-result.ts';
import type { Workflow } from '../core/models/workflow.ts';

export type DefaultWorkflowOptions = {
  implement: (instructions: string, artifactsPath: string) => void | Promise<void>;
  test: (instructions: string, artifactsPath: string) => TestResult | Promise<TestResult>;
  fix: (instructions: string, artifactsPath: string) => void | Promise<void>;
};

export class DefaultWorkflow implements Workflow {
  private implement: (instructions: string, artifactsPath: string) => void | Promise<void>;
  private test: (instructions: string, artifactsPath: string) => TestResult | Promise<TestResult>;
  private fix: (instructions: string, artifactsPath: string) => void | Promise<void>;

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
  private async runTask(task: Task, emitter: EventEmitter): Promise<void> {
    if (task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        await this.runTask(subtask, emitter);
      }
    } else {
      await this.runImplementationStage(task);
      await this.runTestingStage(task);
    }
  }

  private async runImplementationStage(task: Task): Promise<void> {
    // TODO: Move artifacts path somewhere else
    await this.implement(task.instructions, './example/__artifacts__');
  }

  private async runTestingStage(task: Task): Promise<void> {
    let failedTests: Array<Test> = [];

    while (true) {
      const reorderedTests = this.reorderTests({
        tests: task.tests,
        startWithTests: failedTests
      });

      failedTests = await this.runTests({
        task,
        tests: reorderedTests,
        resolveAfterFirstFailedTest: true,

        // TODO: Move artifacts path somewhere else
        artifactsPath: './example/__artifacts__'
      });

      if (failedTests.length === 0) {
        break;
      }

      const fixInstructions = `Previously, you've implemented the following task:\n\n====================\n${task.instructions}\n====================\n\nOne of the tests failed: ${failedTests.map((test) => test.name).join(', ')}\n\nPlease fix it by editing the existing solution`;

      await this.fix(fixInstructions, './example/__artifacts__');
    }
  }

  private reorderTests({
    tests,
    startWithTests
  }: {
    tests: Array<Test>,
    startWithTests: Array<Test>
  }): Array<Test> {
    if (startWithTests.length === 0) {
      return tests;
    }

    const reorderedTests: Array<Test> = [];

    for (const test of startWithTests) {
      reorderedTests.push(test);
    }

    for (const test of tests) {
      const existingTest = reorderedTests.find((item) => item.name === test.name);
      if (!existingTest) {
        reorderedTests.push(test);
      }
    }

    return reorderedTests;
  }

  private async runTests({
    task,
    tests,
    resolveAfterFirstFailedTest,
    artifactsPath
  }: {
    task: Task,
    tests: Array<Test>,
    resolveAfterFirstFailedTest: boolean,
    artifactsPath: string
  }): Promise<Array<Test>> {
    const failedTests: Array<Test> = [];

    for (const test of tests) {
      const testResult = await this.runTest(task, test, artifactsPath);

      if (testResult.status === 'failed') {
        console.log('Test failed', test);

        failedTests.push(test);

        if (resolveAfterFirstFailedTest) {
          return failedTests;
        }
      }
    }

    return failedTests;
  }

  private async runTest(task: Task, test: Test, artifactsPath: string): Promise<TestResult> {
    let testResult: TestResult | null = null;

    if (test instanceof AgenticTest) {
      testResult = await this.runAgenticTest(task, test, artifactsPath);
    } else if (test instanceof DeterministicTest) {
      testResult = await this.runDeterministicTest(task, test, artifactsPath);
    }

    if (!testResult) {
      throw new Error('No test result!');
    }

    return testResult;
  }

  private async runAgenticTest(task: Task, test: AgenticTest, artifactsPath: string): Promise<TestResult> {
    const testInstructions = `You are the task result validator. Please read the original task implemented by developer:\n\n====================\n${task.instructions}\n====================\n\n${test.instructions}\n\nIMPORTANT: Once you're done with validation, execute the 'approve' tool to approve the result, or execute the 'reject' tool to reject the result and provide the reason.`;
    const testResult = await this.test(testInstructions, artifactsPath);

    return testResult;
  }

  private async runDeterministicTest(task: Task, test: DeterministicTest, artifactsPath: string): Promise<TestResult> {
    const importModule = async (modulePath: string): Promise<any> => {
      return await import(`${resolve(artifactsPath, modulePath)}?t=${Date.now()}`);
    };

    const testResult = await test.run(importModule);

    return testResult;
  }
}
