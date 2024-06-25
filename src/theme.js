import {
	checkIsSetupExists,
	checkRequirements,
	clearConsole,
	cloneRepoTo,
	getProjectOutputPath,
	installComposerDependencies,
	installStep,
	outputSetupMessage,
	wpThemeActivate,
	writeIntro,
} from './helpers.js';
import { join } from 'path';

export const themeCommand = async (args) => {
	// Set the theme name.
	const themeName = 'eightshift-boilerplate';

	// Get the output path for the project.
	const outputParentPath = getProjectOutputPath('themes');
	const outputPath = join(outputParentPath, themeName);

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
		describe: `Cloning the boilerplate theme setup repository`,
		thisHappens: cloneRepoTo(
			args.setupRepoUrl,
			outputPath,
			args.setupRepoBranch
		),
	});

	// Activate theme.
	await installStep({
		describe: 'Activating your setup theme',
		thisHappens: wpThemeActivate(themeName),
		isFatal: false,
	});

	// Install all composer packages.
	await installStep({
		describe: `Installing boilerplate setup Composer packages`,
		thisHappens: installComposerDependencies(outputPath, args.setupLibsRepoBranch),
	});

	outputSetupMessage('theme');
}
