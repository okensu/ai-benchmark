import { BenchmarkOptions } from '../types/benchmark-options.ts';
import { BenchmarkRun } from './benchmark-run.ts';

export class Benchmark {
  private model: string;

  constructor(options: BenchmarkOptions) {
    this.model = options.model;
  }

  public async run(): Promise<BenchmarkRun> {
    const benchmarkRun = new BenchmarkRun();

    return benchmarkRun;
  }
}
