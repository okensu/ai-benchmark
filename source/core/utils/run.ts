import { RunResult } from '../models/run-result.ts';
import type { RunOptions } from '../types/run-options.ts';
import { defaultPlugins } from './default-plugins.ts';
import { defaultTasks } from './default-tasks.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const result = new RunResult({
    model: options.model,
    workflow: options.workflow,
    plugins: options.plugins ?? defaultPlugins(),
    tasks: options.tasks ?? defaultTasks()
  });

  for (const plugin of result.plugins) {
    plugin.onRunStarted();
  }

  await result.workflow.run(result);

  for (let i = result.plugins.length - 1; i >= 0; i--) {
    result.plugins[i].onRunFinished();
  }

  return result;
}
