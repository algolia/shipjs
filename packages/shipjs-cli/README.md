shipjs
======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/shipjs.svg)](https://npmjs.org/package/shipjs)
[![Downloads/week](https://img.shields.io/npm/dw/shipjs.svg)](https://npmjs.org/package/shipjs)
[![License](https://img.shields.io/npm/l/shipjs.svg)](https://github.com/packages/shipjs/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g shipjs
$ ship COMMAND
running command...
$ ship (-v|--version|version)
shipjs/0.0.0 darwin-x64 node-v8.16.0
$ ship --help [COMMAND]
USAGE
  $ ship COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ship hello [FILE]`](#ship-hello-file)
* [`ship help [COMMAND]`](#ship-help-command)

## `ship hello [FILE]`

describe the command here

```
USAGE
  $ ship hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ship hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/packages/shipjs/blob/v0.0.0/src/commands/hello.ts)_

## `ship help [COMMAND]`

display help for ship

```
USAGE
  $ ship help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->
