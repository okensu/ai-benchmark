import type { TestResult } from '../models/test-result.ts';
import type { Test } from '../models/test.ts';

export type DefaultWorkflowOptions = {
  implement: (instructions: string) => void | Promise<void>;
  test: (test: Test) => TestResult | Promise<TestResult>;
  fix: (instructions: string) => void | Promise<void>;
};
