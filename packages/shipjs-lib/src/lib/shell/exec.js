import { execaCommandSync } from 'execa';

export default function exec(
  command,
  { dir = '.', ignoreError = false, silent = false } = {}
) {
  try {
    const result = execaCommandSync(command, {
      cwd: dir,
      shell: true,
      reject: false,
      stdio: silent ? 'pipe' : 'inherit',
    });

    // When stdio is 'inherit', stdout/stderr are not captured
    const stdout = result.stdout ?? '';
    const stderr = result.stderr ?? '';

    if (result.exitCode === 0) {
      return {
        code: 0,
        stdout,
        stderr,
        toString: () => stdout,
      };
    }

    if (ignoreError) {
      return {
        code: result.exitCode,
        stdout,
        stderr,
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
            stdout,
            stderr,
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
