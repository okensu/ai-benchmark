import type { TestResult } from '../models/test-result.ts';

export type DeterministicTestOptions = {
  name: string;
  run: (importModule: (modulePath: string) => any) => TestResult | Promise<TestResult>;
};
