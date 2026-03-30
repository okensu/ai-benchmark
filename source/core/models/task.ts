import type { Test } from './test.ts';

export abstract class Task {
  public abstract name: string;
  public abstract instructions: string;
  public abstract subtasks: Array<Task>;
  public abstract tests: Array<Test>;
}
