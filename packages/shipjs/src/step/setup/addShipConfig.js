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
  dryRun,
}) =>
  await runStep({ title: 'Creating ship.config.js' }, async () => {
    const { buildExists } = checkIfScriptsExist({ dir });
    const mergeStrategy = getMergeStrategy({ baseBranch, releaseBranch });

    const config = {
      ...(isScoped &&
        isPublic && {
          publishCommand: ({ defaultCommand }) =>
            `${defaultCommand} --access public`,
        }),
      ...(mergeStrategy && { mergeStrategy }),
      ...(useMonorepo && {
        monorepo: {
          mainVersionFile,
          packagesToBump,
          packagesToPublish,
        },
      }),
      ...(!buildExists && { buildCommand: () => null }),
    };
    const isConfigEmpty = Object.keys(config).length === 0;

    if (dryRun) {
      print(`ship.config.js`);
      print(serialize(config));
    } else if (!isConfigEmpty) {
      const filePath = path.resolve(dir, 'ship.config.js');
      fs.writeFileSync(
        filePath,
        `module.exports = ${serialize(config, { unsafe: true })};`
      );
      await runPrettier({ filePath, dir });
    }

    return () => {
      if (isConfigEmpty) {
        print(`${info('✔')} No \`ship.config.js\` required.`);
      } else {
        print(`${info('✔')} Created \`ship.config.js\`.`);
      }
      print('  You can learn more about the configuration.');
      print(
        '  > https://community.algolia.com/shipjs/guide/useful-config.html'
      );
    };
  });

function getMergeStrategy({ baseBranch, releaseBranch }) {
  if (baseBranch === releaseBranch && baseBranch === 'master') {
    return null; // Let's leave this empty and use the default config instead.
  }

  return baseBranch === releaseBranch
    ? {
        toSameBranch: [baseBranch],
      }
    : {
        toReleaseBranch: {
          [baseBranch]: releaseBranch,
        },
      };
}

function checkIfScriptsExist({ dir }) {
  const filePath = path.resolve(dir, 'package.json');
  const json = JSON.parse(fs.readFileSync(filePath).toString());
  const { build } = json.scripts || {};
  return {
    buildExists: Boolean(build),
  };
}
