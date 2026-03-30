import { Benchmark } from './core/models/benchmark.ts';
import { readConfiguration } from './core/utils/read-configuration.ts';

async function main(): Promise<void> {
  const configuration = await readConfiguration();

  const benchmark = new Benchmark({
    model: configuration.model
  });

  console.log(benchmark);

  const benchmarkRun = await benchmark.run();

  console.log(benchmarkRun);
}

main();
