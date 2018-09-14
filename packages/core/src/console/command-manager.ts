import {Injectable, InjectionToken} from 'injection-js';
import {AbstractCommand} from './abstract-command';
const cli = require('yargs');

export const COMMAND_REGISTRY = new InjectionToken<AbstractCommand[]>('COMMAND_REGISTRY');

@Injectable()
export class CommandManager {

  commands: Object[] = [];

  constructor(private registry: AbstractCommand[]) {
    registry.forEach((command) => {
      let obj = {
        'command': command.command,
        'describe': command.describe,
        'handler': command.handler.bind(command)
      };

      if (typeof command['builder'] === 'function') {
        obj['builder'] = command['builder'].bind(command);
      }
      this.commands.push(obj);
    });
  }

  execute(): void {
    require('yargonaut')
      .style('blue')
      .style('yellow', 'required')
      .helpStyle('green')
      .errorsStyle('red')
    ;

    cli.usage(`Usage: $0 <command> [options]`);
    this.commands.forEach((command) => {
      cli.command(command);
    });

    cli.demandCommand(1)
      .strict()
      .alias('v', 'version')
      .help('h')
      .alias('h', 'help')
      .argv
    ;
  }

  getCommand(command: string): AbstractCommand {
    return this.registry.find((service: AbstractCommand) =>  service.command === command);
  }
}