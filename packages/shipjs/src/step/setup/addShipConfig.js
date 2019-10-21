import runStep from '../runStep';
import fs from 'fs';
import path from 'path';

export default ({
  baseBranch,
  releaseBranch,
  useMonorepo,
  mainVersionFile,
  packagesToBump,
  packagesToPublish,
  dir,
}) =>
  runStep({ title: 'Adding ship.config.js' }, () => {
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
  });
