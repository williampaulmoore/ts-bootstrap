import { Command } from 'commander';

export function tscli(): Command {
    const cmd = new Command('tscli');

    cmd
      .description('Create a typescript cli project')
      .action(async () => console.log('tscli'));

    return cmd; 
}

