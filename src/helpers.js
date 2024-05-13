import chalk from 'chalk';
import figlet from 'figlet';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { exec } from 'promisify-child-process';
import ora from 'ora';

//-------------------------------------------------------
// Helpers
//-------------------------------------------------------

/**
 * Success message.
 *
 * @param {string} msg Message to output.
 */
const error = (msg) => console.log(`${chalk.white.bgRed('Error')}${chalk.red(' - ')}${msg}`);

/**
 * Installs composer package.
 *
 * @param {string} projectPath Path to the project.
 * @param {string} packageToInstall Name of the package to install.
 */
const installComposerPackage = async (projectPath, packageToInstall) => {
	exec(`cd "${projectPath}" && composer require ${packageToInstall} --no-interaction`)
};

/**
 * Check Node.js version
 */
const checkNodeVersion = async () => exec(`node -v`);
/**
 * Check Composer version
 */
const checkComposerVersion = async () => exec(`composer -v`);
/**
 * Check WP-CLI version
 */
const checkWPCliVersion = async () => exec(`wp --info`);

/**
 * Check Git version
 */
const checkGitVersion = async () => exec(`git --version`);

//-------------------------------------------------------
// Exports
//-------------------------------------------------------

/**
 * Finds the root directory of the project by searching for wp-config.php.
 *
 * @param {string} currentDir Current directory.
 */
const findProjectRoot = (currentDir) => {
	if (!currentDir || currentDir === '/') {
		// Reached the root without finding wp-config.php
		return null;
	}

	const wpConfigPath = join(currentDir, 'wp-config.php');
	const wpConfigExists = existsSync(wpConfigPath);

	if (wpConfigExists) {
		// Found wp-config.php, return the current directory as the project root
		return currentDir;
	}

	// Move up one directory level and continue the search
	const parentDir = dirname(currentDir);
	return findProjectRoot(parentDir);
};

/**
 * Gets the output path for the project.
 *
 * @param {string} dirname Directory name.
 */
export const getProjectOutputPath = (dirname) => {
	const rootDir = findProjectRoot(process.cwd());

	if (!rootDir) {
		error('Unable to find project root.');
		process.exit(1);
	}

	return join(rootDir, 'wp-content', dirname);
};

/**
 * Empty the console.
 */
export const clearConsole = () => {
	process.stdout.write('\x1Bc');
};

/**
 * Writes the intro message to the console.
 */
export const writeIntro = () => {
	const figletOpts = {
		font: 'ANSI Regular',
		width: 74,
		whitespaceBreak: true,
		verticalLayout: 'fitted',
	};

	const topBar = chalk.dim(`╭${'─'.repeat(76)}╮`);
	const bottomBar = chalk.dim(`╰${'─'.repeat(76)}╯`);
	const emptyBar = chalk.dim(`│${' '.repeat(76)}│`);
	const midBar = chalk.dim(`├${'─'.repeat(76)}┤`);

	// eslint-disable-next-line max-len
	const processFiglet = (input) => input.split("\n").filter((line) => line.trim().length > 0).map((line) => `${chalk.dim('│')}  ${line.trim().padEnd(74, ' ')}${chalk.dim('│')}`).join("\n");
	const processRedFiglet = (input) => input.map((line) => `${chalk.dim('│')}  ${chalk.redBright(line.padEnd(74, ' '))}${chalk.dim('│')}`).join("\n");
	const processLine = (input) => `${chalk.dim('│')}  ${input.trim().padEnd(74, ' ')}${chalk.dim('│')}`;

	const infinumLogoRaw = ["  ███████  ███████", "██       ██       ██", "██       ██       ██", "  ███████  ███████"];

	const infinumLogo = processRedFiglet(infinumLogoRaw);
	const esText = processFiglet(figlet.textSync('Eightshift', figletOpts));
	const devKitText = processFiglet(figlet.textSync('DevKit', figletOpts));

	// eslint-disable-next-line max-len
	console.log([topBar, emptyBar, infinumLogo, emptyBar, esText, emptyBar, devKitText, emptyBar, midBar, emptyBar, processLine('Thank you for using Eightshift DevKit!'), emptyBar, bottomBar, ''].join("\n"));
};

/**
 * Checks if the setup already exists.
 *
 * @param {string} folderPath Path to the folder.
 * @param {string} type Type of the setup.
 */
export const checkIsSetupExists = (folderPath, type) => {
	if (existsSync(folderPath)) {
		console.log('');
		error(`It looks like your all-ready have a setup ${type} in your project on path ${folderPath}. Please remove it and try again.`);
		process.exit(1);
	}
}

/**
 * Install step.
 *
 * @param {string} describe Description of the step.
 * @param {Promise} thisHappens Promise that needs to be resolved.
 * @param {boolean} isFatal Is the step fatal.
 */
export const installStep = async ({ describe, thisHappens, isFatal = true }) => {
	const spinner = ora({ text: describe, color: 'blue' }).start();

	if (!thisHappens) {
		throw new Error(`Missing 'thisHappens' parameter for step ${describe}, don't know what needs to be done at this step, aborting.`);
	}

	await thisHappens.then(() => {
		spinner.succeed();
	}).catch((exception) => {
		console.log(exception);
		spinner.fail();
		error(exception);

		if (isFatal) {
			error(`'${describe}' was a required step, exiting.`);
			process.exit(1);
		}
	});
};

/**
 * Checks if all requirements are installed.
 */
export const checkRequirements = async () => {
	const nodeVersion = await checkNodeVersion();
	if (nodeVersion.stderr !== '') {
		console.log('');
		error('Node.js is not installed. Please install Node.js LTS version.');
		process.exit(1);
	};

	const composerVersion = await checkComposerVersion();
	if (composerVersion.stderr !== '') {
		console.log('');
		error('Composer is not installed. Please install Composer LTS version.');
		process.exit(1);
	}

	const wpCliVersion = await checkWPCliVersion();
	if (wpCliVersion.stderr !== '') {
		console.log('');
		error('WP-CLI is not installed. Please install WP-CLI 2.9.0+ version.');
		process.exit(1);
	}

	const gitVersion = await checkGitVersion();
	if (gitVersion.stderr !== '') {
		console.log('');
		error('Git is not installed. Please install Git LTS version.');
		process.exit(1);
	}

	return true;
};

/**
 * Outputs the alert box.
 *
 * @param {string} msg Message to output.
 * @param {string} title Title of the alert.
 * @param {string} type Type of the alert.
 * @param {object} config Configuration object.
 */
export const alertBox = (msg, title, type = 'info', config = {}) => {
	// If in a test environment, skip the prompt.
	if (typeof jest !== 'undefined') {
		return `[${type.toUpperCase()}] ${title}: ${msg}`;
	}

	let autoTitle = '';

	const colorText = (input, bold = false) => {
		if (type === 'error') {
			autoTitle = 'Something went wrong';
			return bold ? chalk.red.bold(input) : chalk.red(input);
		} else if (type === 'success') {
			autoTitle = 'Success';
			return bold ? chalk.green.bold(input) : chalk.green(input);
		}

		autoTitle = 'Info';
		return bold ? chalk.blue.bold(input) : chalk.blue(input);
	};

	const omitFirstLine = config?.omitFirstLine ?? false;
	const omitLastLine = config?.omitLastLine ?? false;

	const formattedMsg = msg.split("\n").map((line) => `${colorText('│')}${chalk.reset()} ${line.trim().replace("\n", '')}`);
	const formattedTitle = (title ?? autoTitle).length > 0 ? (title ?? autoTitle).split("\n").map((line) => `${colorText('│')}${chalk.reset()} ${colorText(line.trim().replace("\n", ''), true)}`) : [];

	const alertBody = [
		...formattedTitle,
		...formattedMsg,
	];

	if (omitFirstLine && !omitLastLine) {
		console.log([...alertBody, colorText('╰')].join("\n"));
	} else if (!omitFirstLine && omitLastLine) {
		console.log([colorText('╭'), ...alertBody].join("\n"));
	} else if (omitFirstLine && omitLastLine) {
		console.log(alertBody.join("\n"));
	} else {
		console.log([colorText('╭'), ...alertBody, colorText('╰')].join("\n"));
	}
};

/**
 * Clones the repository to a specific folder.
 *
 * @param {string} repo Repository URL.
 * @param {string} folderName Folder name.
 * @param {string} branch Branch name.
 */
export const cloneRepoTo = async (repo, folderName, branch = '') => {
	const repoCommand = branch.length ? `-b ${branch} ${repo}` : repo;
	const command = `git clone ${repoCommand} "${folderName}"`;
	return exec(command, { timeout: 45000 });
};

/**
 * Installs composer packages and modifies the libs to a specific branch.
 *
 * @param {string} projectPath Path to the project.
 * @param {array} branch Name of the branch to pull from.
 */
export const installComposerDependencies = async (projectPath, branch = '') => {
	const url = 'infinum/eightshift-libs';

	const output = branch ? `${url}:dev-${branch}` : url;

	if (branch) {
		return installComposerPackage(projectPath, output);
	}

	return installComposerPackage(projectPath, output);
};

/**
 * Activates the theme.
 *
 * @param {string} name Name of the theme.
 */
export const wpThemeActivate = async (name) => exec(`wp theme activate ${name}`);

/**
 * Activates the plugin.
 *
 * @param {string} name Name of the plugin.
 */
export const wpPluginActivate = async (name) => exec(`wp plugin activate ${name}`);

/**
 * Outputs the setup message.
 *
 * @param {string} type Type of the setup.
 * @param {object} args Arguments passed to the command.
 */
export const outputSetupMessage = (type, args) => {
	let params = '';

	if (args.libsRepoBranch) {
		params += ` --g_libs_version='${args.libsRepoBranch}'`;
	}

	if (args.frontendLibsRepoBranch) {
		params += ` --g_frontend_libs_version='${args.frontendLibsRepoBranch}'`;
	}

	let msg = 'To finish your setup please run one the following commands:\n\n';

	msg += `Setup ${type} fast:\n`;
	msg += chalk.blue.bold(`wp boilerplate init ${type}-setup${params} --prompt='g_project_name'`);
	msg += `\n\nor setup ${type} full:\n`;
	msg += chalk.blue.bold(`wp boilerplate init ${type}-setup${params} --prompt='g_project_name,g_project_description,g_project_author,g_project_author_url'`);

	alertBox(
		msg,
		'Boilerplate setup is ready for you! 🚀',
		'success',
		{ omitLastLine: false }
	);
}
