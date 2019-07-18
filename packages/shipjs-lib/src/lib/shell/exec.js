import execa from 'execa';

export default function exec(
  command,
  { dir, ignoreError = false, silent = false } = {}
) {
  try {
    const result = execa.commandSync(command, { cwd: dir });
    if (!silent) {
      /* eslint-disable no-console */
      console.log(result.stdout);
      console.log(result.stderr);
      /* eslint-enable no-console */
    }
    return {
      toString: () => result.stdout,
      code: result.exitCode,
    };
  } catch (err) {
    if (ignoreError) {
      return {
        toString: () => '',
        code: err.exitCode,
      };
    } else {
      console.error(err);
      throw err;
    }
  }
}
