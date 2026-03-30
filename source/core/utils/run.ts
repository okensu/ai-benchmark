import { RunResult } from '../models/run-result.ts';
import { RunOptions } from '../types/run-options.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const result = new RunResult({
    model: options.model
  });

  result.setStartedAt(new Date());
  result.setStartedAtTimestamp(performance.now());

  // TODO: run benchmark here

  result.setFinishedAtTimestamp(performance.now());
  result.setFinishedAt(new Date());
  result.calculateDuration();

  return result;
}
