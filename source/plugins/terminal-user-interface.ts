import type { EventEmitter } from 'node:events';
import blessed from 'blessed';
import type { Task } from '../core/models/task.ts';
import type { Test } from '../core/models/test.ts';
import type { Plugin } from '../core/models/plugin.ts';

export class TerminalUserInterfacePlugin implements Plugin {
  public name: string;
  public screen: blessed.Widgets.Screen | null;

  private model: string | null;
  private tasks: Array<Task>;
  private task: Task | null;

  private testToTextElementMap: Map<Test, blessed.Widgets.TextElement>;
  private testingIteration: number;

  constructor() {
    this.name = 'terminal-user-interface';
    this.screen = null;

    this.model = null;
    this.tasks = [];
    this.task = null;

    this.testToTextElementMap = new Map();
    this.testingIteration = 0;
  }

  public initialize(emitter: EventEmitter): void {
    this.screen = blessed.screen({
      smartCSR: true,
      terminal: 'xterm-256color',
      fullUnicode: true
    });

    const content = blessed.layout({
      layout: 'inline-block',
      width: '100%',
      height: '100%',
      padding: {
        top: 1,
        bottom: 1
      }
    });

    const taskElement = blessed.text({
      hidden: true,
      padding: {
        left: 1,
        right: 1
      },
      style: {
        bg: 'blue',
        fg: 'black'
      }
    });

    const spacer1 = blessed.box({
      width: '100%',
      height: 1
    });

    const statusElement = blessed.text({
      hidden: true,
      width: '100%',
      height: 1,
      padding: {
        left: 1,
        right: 1
      },
      content: '',
      style: {
        fg: 'cyan'
      }
    });

    const spacer2 = blessed.box({
      width: '100%',
      height: 1
    });

    let testsElement = blessed.text({
      hidden: true,
      width: '100%',
      height: 1,
      padding: {
        left: 1,
        right: 1
      }
    });

    content.append(taskElement);
    content.append(spacer1);
    content.append(statusElement);
    content.append(spacer2);
    content.append(testsElement);

    this.screen.append(content);

    this.screen.key(['C-c'], () => {
      process.exit(0);
    });

    this.screen.render();

    emitter.on('run:started', ({ model, tasks }) => {
      this.model = model;
      this.tasks = tasks;
    });

    emitter.on('task:started', ({ task }) => {
      this.task = task;

      taskElement.hidden = false;
      taskElement.setContent(task.name);

      this.screen!.render();
    });

    emitter.on('task:implementation:started', () => {
      statusElement.hidden = false;
      statusElement.setContent('Implementing initial solution...');

      this.screen!.render();
    });

    emitter.on('task:testing:running-tests', () => {
      this.testingIteration++;

      statusElement.setContent(
        (this.testingIteration === 1)
          ? 'Testing...'
          : 'Re-testing...'
      );

      testsElement.detach();

      testsElement = blessed.layout({
        layout: 'inline',
        width: '100%',
        height: 1,
        padding: {
          left: 1,
          right: 1
        }
      });

      this.testToTextElementMap = new Map();

      for (const test of this.task!.tests) {
        const testElement = blessed.text({
          content: '󰜌',
          style: {
            fg: 'gray'
          }
        });

        testsElement.append(testElement);

        this.testToTextElementMap.set(test, testElement);
      }

      content.append(testsElement);

      this.screen!.render();
    });

    emitter.on('task:testing:fixing', () => {
      statusElement.setContent('Fixing issue...');
      this.screen!.render();
    });

    emitter.on('test:started', ({ test }) => {
      const testElement = this.testToTextElementMap.get(test);

      if (testElement) {
        statusElement.setContent(`Testing '${test.name}'...`)

        testElement.style.fg = 'yellow';
        testElement.setContent('󰜋');
        this.screen!.render();
      }
    });

    emitter.on('test:passed', ({ test }) => {
      const testElement = this.testToTextElementMap.get(test);

      if (testElement) {
        testElement.style.fg = 'green';
        testElement.setContent('󰜋');
        this.screen!.render();
      }
    });

    emitter.on('test:failed', ({ test }) => {
      const testElement = this.testToTextElementMap.get(test);

      if (testElement) {
        testElement.style.fg = 'red';
        testElement.setContent('󱇎');
        this.screen!.render();
      }
    });

    emitter.on('run:finished', () => {
      statusElement.setContent('Done');
      testsElement.detach();

      this.screen!.render();
    });
  }
}
