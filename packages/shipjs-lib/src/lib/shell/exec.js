import execa from 'execa';

export default function exec(
  command,
  { dir, ignoreError = false, silent = false } = {}
) {
  const arr = command.split(' ');
  try {
    const result = execa.sync(arr[0], arr.slice(1), { cwd: dir });
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
      throw err;
    }
  }
}
