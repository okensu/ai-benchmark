import type { TestResultOptions } from '../types/test-result-options.ts';
import type { TestResultStatus } from '../types/test-result-status.ts';

export class TestResult {
  public status: TestResultStatus;
  public reason?: string;

  constructor(options: TestResultOptions) {
    this.status = options.status;
    this.reason = options.reason;
  }
}
