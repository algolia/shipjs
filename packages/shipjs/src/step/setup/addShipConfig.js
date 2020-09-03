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
  useMonorepo,
  mainVersionFile,
  packagesToBump,
  packagesToPublish,
  dir,
  dryRun,
}) =>
  await runStep({ title: 'Creating ship.config.js' }, async () => {
    const { buildExists } = checkIfScriptsExist({ dir });

    const config = {
      ...(isScoped &&
        isPublic && {
          publishCommand: ({ defaultCommand, tag }) =>
            `${defaultCommand} --access public --tag ${tag}`,
        }),
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

function checkIfScriptsExist({ dir }) {
  const filePath = path.resolve(dir, 'package.json');
  const json = JSON.parse(fs.readFileSync(filePath).toString());
  const { build } = json.scripts || {};
  return {
    buildExists: Boolean(build),
  };
}
