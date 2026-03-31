import { defaultWorkflow, run, Test, TestResult } from '../source/index.ts';

async function main(): Promise<void> {
  const result = await run({
    model: 'Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf',
    workflow: defaultWorkflow({
      implement: async (instructions: string): Promise<void> => {
        // TODO: Implement
      },
      test: async (test: Test): Promise<TestResult> => {
        // TODO: Implement

        const result = new TestResult();

        return result;
      },
      fix: async (instructions: string): Promise<void> => {
        // TODO: Implement
      }
    })
  });

  console.log(result);
}

main();
