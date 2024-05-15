# Create a new WordPress theme

## Requirements

To have the smoothest development and setup experience, you need to install a few things on your computer. Please install these packages before you start the setup:

- [Node.js](https://nodejs.org/en/)
- [Composer](https://getcomposer.org/)
- [WP-CLI](https://wp-cli.org/)
- [Git](https://git-scm.com/)

Make sure that you have all these packages installed and ready to use on your system. To make sure that they work, run these commands:

- `node -v`
- `composer -v`
- `wp --info`
- `git --version`

If it doesn't return any errors, you are good to go.

## Theme installation

Navigate to any folder in your WordPress project where you want to install a new theme and run this command:

`npx eightshift-create theme`

The script will install the latest version of the Setup script and run it. After the script is finished, please follow the instructions provided by the setup script.

## Plugin installation

Navigate to any folder in your WordPress project where you want to install a new plugin and run this command:

`npx eightshift-create plugin`

The script will install the latest version of the Setup script and run it. After the script is finished, please follow the instructions provided by the setup script.

## Specify version to create

If you want to specify some custom version for the packages you can use the following flags. 

```
--setupRepoUrl
--setupRepoBranch
--libsRepoBranch
--frontendLibsRepoBranch
```

You can get a list of available script arguments by running:

`npx eightshift-create --help`

## Development

To do any development on the actual setup script you can run it locally by providing the full path to the script.

`/<pwd_path>/eightshift-create.js theme`
`/<pwd_path>/eightshift-create.js plugin`
