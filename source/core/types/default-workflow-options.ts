import type { TestResult } from '../models/test-result.ts';

export type DefaultWorkflowOptions = {
  implement: (instructions: string, artifactsPath: string) => void | Promise<void>;
  test: (instructions: string, artifactsPath: string) => TestResult | Promise<TestResult>;
  fix: (instructions: string, artifactsPath: string) => void | Promise<void>;
};
