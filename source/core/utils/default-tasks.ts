import { ImplementFibonacciGeneratorTask } from '../../tasks/implement-fibonacci-generator.ts';
import type { Task } from '../models/task.ts';

export function defaultTasks(): Array<Task> {
  return [
    new ImplementFibonacciGeneratorTask()
  ];
}
