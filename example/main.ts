import { run } from '../source/index.ts';

async function main(): Promise<void> {
  const result = await run({
    model: 'Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf'
  });

  console.log(result);
}

main();
