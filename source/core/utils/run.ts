import { defaultPlugins } from '../utils/default-plugins.ts';
import { RunResult } from '../models/run-result.ts';
import type { RunOptions } from '../types/run-options.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const result = new RunResult({
    model: options.model,
    plugins: options.plugins || defaultPlugins()
  });

  for (const plugin of result.plugins) {
    plugin.onRunStarted();
  }

  // TODO: run benchmark here

  for (let i = result.plugins.length - 1; i >= 0; i--) {
    result.plugins[i].onRunFinished();
  }

  return result;
}
