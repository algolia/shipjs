# Commands

## `setup`

```
$ shipjs setup --help
NAME
        shipjs setup - Setup Ship.js in your project.

USAGE
        npx shipjs setup [--help] [--dir PATH] [--dry-run]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -D, --dry-run
          Displays the steps without actually doing them.
```

## `prepare`

```
$ shipjs prepare --help
NAME
        shipjs prepare - Prepare a release.

USAGE
        shipjs prepare [--help] [--dir PATH] [--yes] [--dry-run]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -y, --yes
          Skip all the interactive prompts and use the default values.

        -D, --dry-run
          Displays the steps without actually doing them.
```

## `trigger`

```
$ shipjs trigger --help
NAME
        shipjs trigger - Trigger a release.

USAGE
        shipjs prepare [--help] [--dir PATH] [--dry-run]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -D, --dry-run
          Displays the steps without actually doing them.
```
