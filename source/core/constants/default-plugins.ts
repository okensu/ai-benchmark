import { DurationPlugin } from '../../plugins/duration.ts';
import type { Plugin } from '../models/plugin.ts';

export const defaultPlugins: Array<Plugin> = [
  new DurationPlugin()
];
