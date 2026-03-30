import { defaultWorkflow, run } from '../source/index.ts';

async function main(): Promise<void> {
  const result = await run({
    model: 'Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf',
    workflow: defaultWorkflow({
      implement: () => {},
      test: () => {},
      fix: () => {}
    })
  });

  console.log(result);
}

main();
