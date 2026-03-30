import { DurationPlugin } from '../../plugins/duration.ts';
import { Plugin } from '../models/plugin.ts';

export function defaultPlugins(): Array<Plugin> {
  return [
    new DurationPlugin()
  ];
}
