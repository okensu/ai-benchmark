export abstract class Plugin {
  public abstract name: string;
  public abstract onRunStarted(): void;
  public abstract onRunFinished(): void;
}
