import runStep from '../runStep';
import fs from 'fs';
import path from 'path';
import { runPrettier } from '../../helper';

export default async ({
  baseBranch,
  releaseBranch,
  useMonorepo,
  mainVersionFile,
  packagesToBump,
  packagesToPublish,
  dir,
}) =>
  await runStep({ title: 'Adding ship.config.js' }, async () => {
    const filePath = path.resolve(dir, 'ship.config.js');
    const json = {
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
    fs.writeFileSync(
      filePath,
      `module.exports = ${JSON.stringify(json, null, 2)};`
    );
    await runPrettier({ filePath, dir });
  });
