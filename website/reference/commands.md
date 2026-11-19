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
        shipjs prepare [--help] [--dir PATH] [--yes] [--dry-run] [--no-browse] [--commit-from SHA] [--preid ID]

OPTIONS
        -h, --help
          Print this help

        -d, --dir PATH
          Specify the PATH of the repository (default: the current directory).

        -y, --yes
          Skip all the interactive prompts and use the default values.

        -D, --dry-run
          Displays the steps without actually doing them.

        -N, --no-browse
          Do not open a browser after creating a pull request.

        -c, --commit-from SHA
          Specify from which commit you want to release.

        --preid ID
          Prepare a prerelease on the ID channel (e.g. beta, alpha, rc, next).
          It is published under the npm dist-tag of the same name.
```

See [Prereleases](../guide/useful-config.md#prereleases) for how `--preid` computes versions and picks the npm dist-tag.

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
