import {Injectable} from 'injection-js';
import {AbstractCommand} from './abstract-command';
const cli = require('yargs');

@Injectable()
export class CommandManager {

  commands: Record<string, any>[] = [];

  constructor(private registry: AbstractCommand[]) {
    registry.forEach((command) => {
      const obj = {
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
