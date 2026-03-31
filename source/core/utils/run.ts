import { EventEmitter } from 'node:events';
import { RunResult } from '../models/run-result.ts';
import type { RunOptions } from '../types/run-options.ts';
import { defaultPlugins } from './default-plugins.ts';
import { defaultTasks } from './default-tasks.ts';

export async function run(options: RunOptions): Promise<RunResult> {
  const emitter = new EventEmitter();
  const model = options.model;
  const workflow = options.workflow;
  const plugins = options.plugins ?? defaultPlugins();
  const tasks = options.tasks ?? defaultTasks();

  const result = new RunResult({
    model,
    workflow,
    plugins,
    tasks
  });

  for (const plugin of result.plugins) {
    plugin.initialize(emitter);
  }

  emitter.emit('run:started', {
    model,
    tasks,
  });

  await result.workflow.run(result.tasks, emitter);

  emitter.emit('run:finished');

  return result;
}
