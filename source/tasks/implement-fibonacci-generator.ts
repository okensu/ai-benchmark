import { AgenticTest } from '../core/models/agentic-test.ts';
import { DeterministicTest } from '../core/models/deterministic-test.ts';
import { Task } from '../core/models/task.ts';
import { TestResult } from '../core/models/test-result.ts';
import { Test } from '../core/models/test.ts';

export class ImplementFibonacciGeneratorTask implements Task {
  public name: string;
  public instructions: string;
  public subtasks: Array<Task>;
  public tests: Array<Test>;

  constructor() {
    this.name = 'implement-fibonacci-generator';
    this.instructions = 'Create fibonacci.ts exporting fib(n)';
    this.subtasks = [];
    this.tests = [
      ...this.shouldReturnCorrectValuesTests(),
      new DeterministicTest({
        name: 'should throw error for negative inputs',
        run: async (importModule): Promise<TestResult> => {
          const { fib } = await importModule('./fibonacci.ts');

          try {
            const returnedValue = fib(-1);

            return new TestResult({
              status: 'failed',
              reason: `fib(-1) returned ${returnedValue}`
            });
          } catch {
            return new TestResult({
              status: 'passed'
            });
          }
        }
      }),
      new DeterministicTest({
        name: 'should throw error for decimal inputs',
        run: async (importModule): Promise<TestResult> => {
          const { fib } = await importModule('./fibonacci.ts');

          try {
            const returnedValue = fib(2.5);

            return new TestResult({
              status: 'failed',
              reason: `fib(2.5) returned ${returnedValue}`
            });
          } catch {
            return new TestResult({
              status: 'passed'
            });
          }
        }
      }),

      new AgenticTest({
        name: 'should be self-documented (zero comments)',
        instructions: 'Validate that result is self-documented and doesn\'t have any comments'
      }),
      new AgenticTest({
        name: 'should export function on the same line',
        instructions: 'Validate that result doesn\'t export function on a different line'
      }),
      new AgenticTest({
        name: 'should not use recursion',
        instructions: 'Validate that result doesn\'t use recursion'
      }),
      new AgenticTest({
        name: 'should not have duplicate code',
        instructions: 'Validate that result doesn\'t have duplicate code'
      }),
      new AgenticTest({
        name: 'should be as simple as possible',
        instructions: 'Validate that result is as simple as possible'
      }),
      new AgenticTest({
        name: 'should use descriptive variable names',
        instructions: 'Validate that result uses descriptive variable names'
      }),
      new AgenticTest({
        name: 'should not use shortened variable names (for example, prev)',
        instructions: 'Validate that result does not use shortened variable names (for example, prev)'
      }),
      new AgenticTest({
        name: 'should use single quotes for strings',
        instructions: 'Validate that result uses single quotes for strings'
      })
    ];
  }

  private shouldReturnCorrectValuesTests(): Array<DeterministicTest> {
    const expectedValues = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

    return expectedValues.map((expectedValue, n) => new DeterministicTest({
      name: `fib(${n}) should return ${expectedValue}`,
      run: async (importModule): Promise<TestResult> => {
        const { fib } = await importModule('./fibonacci.ts');
        const returnedValue = fib(n);

        if (returnedValue === expectedValue) {
          return new TestResult({
            status: 'passed'
          });
        } else {
          return new TestResult({
            status: 'failed',
            reason: `fib(${n}) returned ${returnedValue}`
          });
        }
      }
    }));
  }
}
