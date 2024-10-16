import {Injectable} from 'injection-js';
import {AbstractCommand} from './abstract-command';
const yargs = require('yargs/yargs');

@Injectable()
export class CommandManager {

  commands: Record<string, any>[] = [];

  constructor(private registry: AbstractCommand[]) {
    registry.forEach((command: any) => {
      const obj: any = {
        'command': command.command,
        'describe': command.describe,
        'builder': {},
        'handler': command.handler.bind(command)
      };

      if (typeof command['builder'] === 'object') {
        obj['builder'] = command['builder'];
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

    yargs.usage(`Usage: $0 <command> [options]`);
    const cli = yargs(process.argv);
    this.commands.forEach((command) => {
      cli.command(command.command, command.describe, command.builder, command.handler);
    });
    cli.demandCommand(1)
      .help()
      .parse()
    ;
  }

  getCommand(command: string): AbstractCommand {
    return this.registry.find((service: AbstractCommand) =>  service.command === command);
  }
}
