import { RunResultOptions } from '../types/run-result-options.ts';

export class RunResult {
  public model: string;
  public startedAt: Date | null;
  public startedAtTimestamp: number | null;
  public finishedAt: Date | null;
  public finishedAtTimestamp: number | null;
  public durationMs: number | null;

  constructor(options: RunResultOptions) {
    this.model = options.model;
    this.startedAt = null;
    this.startedAtTimestamp = null;
    this.finishedAt = null;
    this.finishedAtTimestamp = null;
    this.durationMs = null;
  }

  public setStartedAt(startedAt: Date): void {
    this.startedAt = startedAt;
  }

  public setStartedAtTimestamp(startedAtTimestamp: number): void {
    this.startedAtTimestamp = startedAtTimestamp;
  }

  public setFinishedAt(finishedAt: Date): void {
    this.finishedAt = finishedAt;
  }

  public setFinishedAtTimestamp(finishedAtTimestamp: number): void {
    this.finishedAtTimestamp = finishedAtTimestamp;
  }

  public calculateDuration(): void {
    this.durationMs = (this.startedAtTimestamp !== null && this.finishedAtTimestamp !== null)
      ? this.finishedAtTimestamp - this.startedAtTimestamp
      : null;
  }
}
