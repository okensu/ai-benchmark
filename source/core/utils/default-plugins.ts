import { TotalDurationPlugin } from '../../plugins/total-duration.ts';
import type { Plugin } from '../models/plugin.ts';

export function defaultPlugins(): Array<Plugin> {
  return [
    new TotalDurationPlugin()
  ];
}
