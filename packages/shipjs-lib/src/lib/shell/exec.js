// eslint-disable-next-line import/no-commonjs
const shell = require('shelljs');
/*
  This used to be `import shell from 'shelljs'`.
  For some reason I don't know, it broke the build.
  
  `var shellMethods = Object.create(shell);`
  The line above is from the build output.
  At the time it was executed, there was no `shell` defined yet.
  So it threw the following:
    TypeError: Object prototype may only be an Object or null: undefined

  I tried many different things to fix this, but couldn't find a solution.
  Using `require` instead of `import` is the only workaround at the moment.
*/

export default function exec(
  command,
  { dir = '.', ignoreError = false, silent = false } = {}
) {
  const result = shell.exec(command, { silent, cwd: dir });
  if (result.code === 0) {
    return result;
  } else if (ignoreError) {
    return {
      toString: () => '',
      code: result.code,
    };
  } else {
    throw new Error(
      JSON.stringify(
        {
          message: `Exit code is ${result.code}`,
          command,
          result,
        },
        null,
        2
      )
    );
  }
}
