import type { EventEmitter } from 'node:events';
import type { Plugin } from '../core/models/plugin.ts';

export class TotalDurationPlugin implements Plugin {
  public name: string;
  public startedAt: Date | null;
  public startedAtTimestamp: number | null;
  public finishedAt: Date | null;
  public finishedAtTimestamp: number | null;
  public durationMs: number | null;

  constructor() {
    this.name = 'total-duration';
    this.startedAt = null;
    this.startedAtTimestamp = null;
    this.finishedAt = null;
    this.finishedAtTimestamp = null;
    this.durationMs = null;
  }

  public initialize(emitter: EventEmitter): void {
    emitter.on('run:started', () => {
      this.startedAt = new Date();
      this.startedAtTimestamp = performance.now();
    });

    emitter.on('run:finished', () => {
      this.finishedAtTimestamp = performance.now();
      this.finishedAt = new Date();
      this.durationMs = this.finishedAtTimestamp - (this.startedAtTimestamp as number);
    });
  }
}
