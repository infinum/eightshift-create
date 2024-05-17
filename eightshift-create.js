#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { themeCommand } from './src/theme.js';
import { pluginCommand } from './src/plugin.js';

// Theme command.
yargs(hideBin(process.argv))
.command('theme', '', (yargs) => {
	return yargs
		.positional('setupRepoUrl', {
			describe: 'Use this to override which eightshift-boilerplate repository is used.',
			default: 'https://github.com/infinum/eightshift-boilerplate.git'
		})
		.positional('setupRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-boilerplate branch is loaded (mainly used for testing).',
			default: 'main'
		})
		.positional('libsRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-libs branch is loaded (mainly used for testing).',
			default: ''
		})
		.positional('frontendLibsRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-frontend-libs branch is loaded (mainly used for testing).',
			default: ''
		})
}, (args) => {
	themeCommand(args);
})
.parse()

// Plugin command.
yargs(hideBin(process.argv))
.command('plugin', '', (yargs) => {
	return yargs
		.positional('setupRepoUrl', {
			describe: 'Use this to override which eightshift-boilerplate-plugin repository is used.',
			default: 'https://github.com/infinum/eightshift-boilerplate-plugin.git'
		})
		.positional('setupRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-boilerplate-plugin branch is loaded (mainly used for testing).',
			default: 'main'
		})
		.positional('libsRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-libs branch is loaded (mainly used for testing).',
			default: ''
		})
		.positional('frontendLibsRepoBranch', {
			describe: 'Use this to override which infinum/eightshift-frontend-libs branch is loaded (mainly used for testing).',
			default: ''
		})
}, (args) => {
	pluginCommand(args);
})
.parse()
