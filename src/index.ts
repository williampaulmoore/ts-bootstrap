#!/usr/bin/env node

import { program } from 'commander';
import { tscli } from './ts-cli';

program
  .name('bspr')
  .description('cli to bootstrap various types of project')
  .addCommand( tscli() ) 
  ;

program.parse(process.argv);
