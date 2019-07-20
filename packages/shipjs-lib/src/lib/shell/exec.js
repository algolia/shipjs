import execa from 'execa';
import tempWrite from 'temp-write';
import fs from 'fs';

export default function exec(
  command,
  { dir, ignoreError = false, silent = false } = {}
) {
  try {
    const filePath = tempWrite.sync(command);
    fs.chmodSync(filePath, '755');
    const result = execa.sync(command, { shell: true, cwd: dir });
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
