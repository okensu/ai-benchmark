import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OpenAI } from 'openai';
import { Agent, run as runAgent, setDefaultOpenAIClient, setTracingDisabled, tool } from '@openai/agents';
import z from 'zod';
import { defaultWorkflow, run, TestResult } from '../source/index.ts';

async function main(): Promise<void> {
  // -----------------------
  // Configure OpenAI client
  // -----------------------
  const client = new OpenAI({
    baseURL: 'http://192.168.88.198:8001/v1',
    apiKey: 'llama.cpp'
  });

  setDefaultOpenAIClient(client);
  setTracingDisabled(true);
  // -----------------------

  // -----------------------
  // Prepare tools
  // -----------------------
  const createFileTool = ({ root }: { root: string }) => tool({
    name: 'create_file',
    description: '',
    parameters: z.object({
      path: z.string(),
      content: z.string()
    }),
    execute: async ({ path, content }) => {
      const filePath = join(root, path);

      await writeFile(filePath, content);

      return `Created ${path}`;
    }
  });

  const readFileTool = ({ root}: { root: string }) => tool({
    name: 'read_file',
    description: '',
    parameters: z.object({
      path: z.string()
    }),
    execute: async ({ path }) => {
      const filePath = join(root, path);

      return await readFile(filePath, 'utf-8');
    }
  });

  const editFileTool = ({ root }: { root: string }) => tool({
    name: 'edit_file',
    description: '',
    parameters: z.object({
      path: z.string(),
      content_to_replace: z.string(),
      replace_with: z.string(),
      replace_all_instances: z.boolean().optional()
    }),
    execute: async ({ path, content_to_replace, replace_with, replace_all_instances }) => {
      const filePath = join(root, path);
      const content = await readFile(filePath, 'utf-8');

      await writeFile(
        filePath,
        (replace_all_instances)
          ? content.replaceAll(content_to_replace, replace_with)
          : content.replace(content_to_replace, replace_with)
      );

      return `Edited ${path}`;
    }
  });
  // -----------------------

  // -----------------------
  // Run benchmark
  // -----------------------
  const result = await run({
    model: 'Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf',
    workflow: defaultWorkflow({
      implement: async (instructions: string, artifactsPath: string): Promise<void> => {
        const developer = new Agent({
          name: 'developer',
          tools: [
            createFileTool({ root: artifactsPath })
          ],
          modelSettings: {
            toolChoice: 'required'
          }
        });

        await runAgent(developer, instructions, {
          maxTurns: 100
        });
      },
      test: async (instructions: string, artifactsPath: string): Promise<TestResult> => {
        let testResult: TestResult | null = null;

        const approveTool = tool({
          name: 'approve',
          description: '',
          parameters: z.object({}),
          execute: () => {
            testResult = new TestResult({
              status: 'passed'
            });
          }
        });

        const rejectTool = tool({
          name: 'reject',
          description: '',
          parameters: z.object({
            reason: z.string()
          }),
          execute: ({ reason }) => {
            testResult = new TestResult({
              status: 'failed',
              reason
            });
          }
        });

        const tester = new Agent({
          name: 'tester',
          tools: [
            readFileTool({ root: artifactsPath }),
            approveTool,
            rejectTool
          ],
          modelSettings: {
            toolChoice: 'required'
          },
          toolUseBehavior: {
            stopAtToolNames: ['approve', 'reject']
          }
        });

        await runAgent(tester, instructions, {
          maxTurns: 100
        });

        return (testResult !== null)
          ? testResult
          : new TestResult({
              status: 'failed',
              reason: 'Validation failed'
            });
      },
      fix: async (instructions: string, artifactsPath: string): Promise<void> => {
        const developer = new Agent({
          name: 'developer',
          tools: [
            createFileTool({ root: artifactsPath }),
            readFileTool({ root: artifactsPath }),
            editFileTool({ root: artifactsPath })
          ],
          modelSettings: {
            toolChoice: 'required'
          }
        });

        await runAgent(developer, instructions, {
          maxTurns: 100
        });
      }
    })
  });

  console.log(result);
  // -----------------------
}

main();
