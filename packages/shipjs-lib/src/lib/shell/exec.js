import shell from 'shelljs';

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
