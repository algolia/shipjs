import { execaCommandSync } from 'execa';

export default function exec(command, { dir = '.', ignoreError = false } = {}) {
  try {
    const result = execaCommandSync(command, {
      cwd: dir,
      shell: true,
      reject: false,
    });

    if (result.exitCode === 0) {
      return {
        code: 0,
        stdout: result.stdout,
        stderr: result.stderr,
        toString: () => result.stdout,
      };
    }

    if (ignoreError) {
      return {
        code: result.exitCode,
        stdout: result.stdout,
        stderr: result.stderr,
        toString: () => '',
      };
    }

    throw new Error(
      JSON.stringify(
        {
          message: `Exit code is ${result.exitCode}`,
          command,
          result: {
            code: result.exitCode,
            stdout: result.stdout,
            stderr: result.stderr,
          },
        },
        null,
        2
      )
    );
  } catch (error) {
    if (ignoreError) {
      return {
        code: 1,
        toString: () => '',
      };
    }
    throw error;
  }
}
