import fs from 'fs';
import path from 'path';
import serialize from 'serialize-javascript';
import runStep from '../runStep';
import { runPrettier } from '../../helper';
import { info } from '../../color';
import { print } from '../../util';

export default async ({
  isScoped,
  isPublic,
  baseBranch,
  releaseBranch,
  useMonorepo,
  mainVersionFile,
  packagesToBump,
  packagesToPublish,
  dir,
}) =>
  await runStep({ title: 'Creating ship.config.js' }, async () => {
    const { testExists, buildExists } = checkIfScriptsExist({ dir });
    const config = {
      ...(isScoped &&
        isPublic && {
          publishCommand: ({ defaultCommand }) =>
            `${defaultCommand} --access public`,
        }),
      mergeStrategy:
        baseBranch === releaseBranch
          ? {
              toSameBranch: [baseBranch],
            }
          : {
              toReleaseBranch: {
                [baseBranch]: releaseBranch,
              },
            },
      ...(useMonorepo && {
        monorepo: {
          mainVersionFile,
          packagesToBump,
          packagesToPublish,
        },
      }),
      ...(!testExists && { testCommandBeforeRelease: () => null }),
      ...(!buildExists && { buildCommand: () => null }),
    };

    const filePath = path.resolve(dir, 'ship.config.js');
    fs.writeFileSync(
      filePath,
      `// eslint-disable-next-line import/no-commonjs\n` +
        `module.exports = ${serialize(config)};`
    );
    await runPrettier({ filePath, dir });

    return () => {
      print(`${info('✔')} Created \`ship.config.js\`.`);
      print('  You can learn more about the configuration.');
      print('  > https://github.com/algolia/shipjs/blob/master/GUIDE.md');
    };
  });

function checkIfScriptsExist({ dir }) {
  const filePath = path.resolve(dir, 'package.json');
  const json = JSON.parse(fs.readFileSync(filePath).toString());
  const { test, build } = json.scripts || {};
  return {
    testExists:
      Boolean(test) && test !== 'echo "Error: no test specified" && exit 1',
    buildExists: Boolean(build),
  };
}
