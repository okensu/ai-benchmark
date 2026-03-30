import type { Plugin } from '../models/plugin.ts';

export type RunOptions = {
  model: string;
  plugins?: Array<Plugin>;
};
