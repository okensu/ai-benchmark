export abstract class Plugin {
  public abstract onRunStarted(): void;
  public abstract onRunFinished(): void;
}
