
# Change Log for the Eightshift Create
All notable changes to this project will be documented in this file.

This projects adheres to [Semantic Versioning](https://semver.org/) and [Keep a CHANGELOG](https://keepachangelog.com/).

## [1.1.0]

### Added
- inquirer dependency for interactive CLI.
- `setupLibsRepoBranch` param for setup.
- Setup will not remove the existing setup if it already exists.
- Setup will now ask for the options for what kind of setup you want to do.
- Setup will now ask for the options for what kind of frontend libs you want to use.
- Setup will now ask for the project name.

### Removed
- `libsRepoBranch` and `frontendLibsRepoBranch` params from setup.

## [1.0.0]

Initial tagged release.

[1.1.0]: https://github.com/infinum/eightshift-create/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/infinum/eightshift-create/releases/tag/1.0.0
