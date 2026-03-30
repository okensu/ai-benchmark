import type { EventEmitter } from 'node:events';
import type { Task } from './task.ts';

export abstract class Workflow {
  public abstract run(tasks: Array<Task>, emitter: EventEmitter): void | Promise<void>;
}
