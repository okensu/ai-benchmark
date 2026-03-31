import type { TestResultStatus } from './test-result-status.ts';

export type TestResultOptions = {
  status: TestResultStatus;
  reason?: string;
};
