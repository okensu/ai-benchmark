import type { Test } from '../models/test.ts';

export type DefaultWorkflowOptions = {
  implement: (instructions: string) => void | Promise<void>;
  test: (test: Test) => void | Promise<void>;
  fix: (instructions: string) => void | Promise<void>;
};
