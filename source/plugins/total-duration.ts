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

  public onRunStarted(): void {
    this.startedAt = new Date();
    this.startedAtTimestamp = performance.now();
  }

  public onRunFinished(): void {
    this.finishedAtTimestamp = performance.now();
    this.finishedAt = new Date();
    this.durationMs = this.finishedAtTimestamp - (this.startedAtTimestamp as number);
  }
}
