import runStep from '../runStep';
import { detectYarn, run } from '../../util';
import fs from 'fs';
import path from 'path';

export default ({ dependencies, dir }) =>
  runStep({ title: 'Adding devDependencies' }, () => {
    const command = detectYarn
      ? `yarn add -D ${dependencies.join(' ')}${
          usesYarnWorkspace(dir) ? ' -W' : ''
        }`
      : `npm install --save-dev ${dependencies.join(' ')}`;
    run({ command, dir, silent: true });
  });

function usesYarnWorkspace(dir) {
  return Boolean(
    JSON.parse(fs.readFileSync(path.resolve(dir, 'package.json')).toString())
      .workspaces
  );
}
