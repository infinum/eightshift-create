import {
	checkIsSetupExists,
	checkRequirements,
	clearConsole,
	cloneRepoTo,
	getProjectOutputPath,
	installComposerDependencies,
	installStep,
	outputSetupMessage,
	wpPluginActivate,
	writeIntro,
} from './helpers.js';
import { join } from 'path';

export const pluginCommand = async (args) => {
	// Set the plugin name.
	const pluginName = 'eightshift-boilerplate-plugin';

	// Get the output path for the project.
	const outputParentPath = getProjectOutputPath('plugins');
	const outputPath = join(outputParentPath, pluginName);

	// Clear console for better UX.
	clearConsole();

	// Write intro message.
	writeIntro();

	// Check if the setup already exists.
	checkIsSetupExists(outputPath);

	// Check if all requirements are installed
	await installStep({
		describe: 'Checking minimal requirements',
		thisHappens: checkRequirements(),
	});

	// Clone repo from git with given arguments
	await installStep({
		describe: `Cloning the boilerplate plugin setup repository`,
		thisHappens: cloneRepoTo(
			args.setupRepoUrl,
			outputPath,
			args.setupRepoBranch
		),
	});

	// Activate plugin.
	await installStep({
		describe: 'Activating your setup plugin',
		thisHappens: wpPluginActivate(pluginName),
		isFatal: false,
	});

	// Install all composer packages.
	await installStep({
		describe: `Installing boilerplate setup Composer packages`,
		thisHappens: installComposerDependencies(outputPath, args.setupLibsRepoBranch),
	});

	outputSetupMessage('plugin');
}
