import { readConfiguration } from './core/utils/read-configuration';

async function main(): Promise<void> {
  const configuration = await readConfiguration();

  console.log('Started');
  console.log(configuration);
}

main();
