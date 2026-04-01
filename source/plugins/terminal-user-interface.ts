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

    const modelRow = blessed.box({
      hidden: true,
      width: '100%',
      height: 1
    });

    const modelElement = blessed.text({
      tags: true,
      padding: {
        left: 1,
        right: 1
      },
      style: {
        fg: 'magenta'
      }
    });

    const taskRow = blessed.box({
      hidden: true,
      width: '100%',
      height: 1
    });

    const taskElement = blessed.text({
      tags: true,
      padding: {
        left: 1,
        right: 1
      },
      style: {
        fg: 'blue'
      }
    });

    const statusRow = blessed.box({
      hidden: true,
      width: '100%',
      height: 1
    });

    const statusElement = blessed.text({
      tags: true,
      padding: {
        left: 1,
        right: 1
      },
      style: {
        fg: 'cyan'
      }
    });

    const spacer1 = blessed.box({
      width: '100%',
      height: 1
    });

    let testsElement = blessed.text({
      hidden: true,
      width: '100%',
      padding: {
        left: 1,
        right: 1
      }
    });

    modelRow.append(modelElement);
    taskRow.append(taskElement);
    statusRow.append(statusElement);

    content.append(modelRow);
    content.append(taskRow);
    content.append(statusRow);
    content.append(spacer1);
    content.append(testsElement);

    this.screen.append(content);

    this.screen.key(['C-c'], () => {
      process.exit(0);
    });

    this.screen.render();

    emitter.on('run:started', ({ model, tasks }) => {
      this.model = model;
      this.tasks = tasks;

      modelRow.hidden = false;
      modelElement.setContent(` {bold}{#333333-fg}Model:{/#333333-fg}{/bold} ${model}`);

      this.screen!.render();
    });

    emitter.on('task:started', ({ task }) => {
      this.task = task;

      taskRow.hidden = false;
      taskElement.setContent(`  {bold}{#333333-fg}Task:{/#333333-fg}{/bold} ${task.name}`);

      this.screen!.render();
    });

    emitter.on('task:implementation:started', () => {
      statusRow.hidden = false;
      statusElement.setContent('{bold}{#333333-fg}Status:{/#333333-fg}{/bold} Implementing initial solution');

      this.screen!.render();
    });

    emitter.on('task:testing:running-tests', () => {
      this.testingIteration++;

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
      statusElement.setContent('{bold}{#333333-fg}Status:{/#333333-fg}{/bold} Fixing issue');
      this.screen!.render();
    });

    emitter.on('test:started', ({ test }) => {
      const testElement = this.testToTextElementMap.get(test);

      if (testElement) {
        statusElement.setContent(`{bold}{#333333-fg}Status:{/#333333-fg}{/bold} Testing '${test.name}'`)

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
      statusElement.setContent('{bold}{#333333-fg}Status:{/#333333-fg}{/bold} Done');
      testsElement.detach();

      this.screen!.render();
    });
  }
}
