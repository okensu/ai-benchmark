import { EventEmitter } from 'node:events';
import { RunResult } from '../models/run-result.ts';
import type { RunOptions } from '../types/run-options.ts';
import { defaultPlugins } from './default-plugins.ts';
import { defaultTasks } from './default-tasks.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const emitter = new EventEmitter();

  const result = new RunResult({
    model: options.model,
    workflow: options.workflow,
    plugins: options.plugins ?? defaultPlugins(),
    tasks: options.tasks ?? defaultTasks()
  });

  for (const plugin of result.plugins) {
    plugin.initialize(emitter);
  }

  emitter.emit('run:started');

  await result.workflow.run(result.tasks, emitter);

  emitter.emit('run:finished');

  return result;
}
