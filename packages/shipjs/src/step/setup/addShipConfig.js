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
    const filePath = path.resolve(dir, 'ship.config.js');
    const json = {
      publishCommand:
        isScoped && isPublic
          ? ({ defaultCommand }) => `${defaultCommand} --access public`
          : undefined,
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
      monorepo: useMonorepo
        ? {
            mainVersionFile,
            packagesToBump,
            packagesToPublish,
          }
        : undefined,
    };

    fs.writeFileSync(filePath, `module.exports = ${serialize(json)};`);
    await runPrettier({ filePath, dir });

    return () => {
      print(`${info('✔')} Created \`ship.config.js\`.`);
      print('  You can learn more about the configuration.');
      print('  > https://github.com/algolia/shipjs/blob/master/GUIDE.md');
    };
  });
