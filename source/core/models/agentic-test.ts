import type { AgenticTestOptions } from '../types/agentic-test-options.ts';
import type { TestType } from '../types/test-type.ts';
import type { Test } from './test.ts';

export class AgenticTest implements Test {
  public type: TestType;
  public name: string;
  public instructions: string;

  constructor(options: AgenticTestOptions) {
    this.type = 'agentic';
    this.name = options.name;
    this.instructions = options.instructions;
  }
}
