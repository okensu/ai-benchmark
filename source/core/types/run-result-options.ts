import type { Plugin } from '../models/plugin.ts';

export type RunResultOptions = {
  model: string;
  plugins: Array<Plugin>;
};
