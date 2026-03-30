import { RunResult } from '../models/run-result.ts';
import { RunOptions } from '../types/run-options.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const result = new RunResult();

  return result;
}
