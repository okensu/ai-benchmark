import type { TestType } from '../types/test-type.ts';

export abstract class Test {
  public abstract type: TestType;
  public abstract name: string;
}
