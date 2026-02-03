import fs from 'fs';
import path from 'path';

import { info } from '../../color.js';
import { detectYarn, run, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ dependencies, dir, dryRun }) =>
  runStep({ title: 'Installing Ship.js' }, () => {
    const command = detectYarn(dir)
      ? `yarn add --exact --dev ${dependencies.join(' ')}${
          usesYarnWorkspace(dir) ? ' -W' : ''
        }`
      : `npm install --save-exact --save-dev ${dependencies.join(' ')}`;
    run({ command, dir, silent: true, printCommand: dryRun, dryRun });
    return () => print(`${info('✔')} Installed shipjs as devDependency.`);
  });

function usesYarnWorkspace(dir) {
  return Boolean(
    JSON.parse(fs.readFileSync(path.resolve(dir, 'package.json'), 'utf-8'))
      .workspaces
  );
}
