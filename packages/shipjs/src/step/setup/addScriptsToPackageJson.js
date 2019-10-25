import runStep from '../runStep';
import fs from 'fs';
import path from 'path';
import { runPrettier } from '../../helper';
import { info } from '../../color';
import { print } from '../../util';

export default ({ dir }) =>
  runStep({ title: 'Adding scripts to package.json' }, () => {
    const filePath = path.resolve(dir, 'package.json');
    const json = JSON.parse(fs.readFileSync(filePath).toString());
    json.scripts = json.scripts || {};
    json.scripts['release:prepare'] = 'shipjs prepare';
    json.scripts['release:trigger'] = 'shipjs trigger';
    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
    runPrettier({ filePath, dir });
    return () =>
      print(
        `${info(
          '✔'
        )} Added \`release:prepare\` and \`release:trigger\` in \`scripts\` section of \`package.json\`.`
      );
  });
