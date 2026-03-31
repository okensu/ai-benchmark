import type { DeterministicTestOptions } from '../types/deterministic-test-options.ts';
import type { TestType } from '../types/test-type.ts';
import type { TestResult } from './test-result.ts';
import type { Test } from './test.ts';

export class DeterministicTest implements Test {
  public type: TestType;
  public name: string;
  public run: (importModule: (modulePath: string) => any) => TestResult | Promise<TestResult>;

  constructor(options: DeterministicTestOptions) {
    this.type = 'deterministic';
    this.name = options.name;
    this.run = options.run;
  }
}
