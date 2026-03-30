import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import type { Configuration } from '../types/configuration.ts';

export async function readConfiguration(): Promise<Configuration> {
  return parse(
    await readFile('./.ai-benchmark.yml', 'utf-8')
  );
}
