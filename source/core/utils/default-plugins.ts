import { DurationPlugin } from '../../plugins/duration.ts';
import type { Plugin } from '../models/plugin.ts';

export function defaultPlugins(): Array<Plugin> {
  return [
    new DurationPlugin()
  ];
}
