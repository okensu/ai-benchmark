import { Task } from '../core/models/task.ts';
import { Test } from '../core/models/test.ts';

export class ImplementFibonacciGeneratorTask implements Task {
  public name: string;
  public instructions: string;
  public subtasks: Array<Task>;
  public tests: Array<Test>;

  constructor() {
    this.name = 'implement-fibonacci-generator';
    this.instructions = 'Create fibonacci.ts exporting fib(n)';
    this.subtasks = [];
    this.tests = [];
  }
}
