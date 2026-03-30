import type { EventEmitter } from 'node:events';

export abstract class Plugin {
  public abstract name: string;
  public abstract initialize(emitter: EventEmitter): void;
}
