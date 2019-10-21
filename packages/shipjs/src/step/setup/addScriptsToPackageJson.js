import runStep from '../runStep';
import fs from 'fs';
import path from 'path';

export default ({ dir }) =>
  runStep({ title: 'Adding scripts to package.json' }, () => {
    const filePath = path.resolve(dir, 'package.json');
    const json = JSON.parse(fs.readFileSync(filePath).toString());
    json.scripts = json.scripts || {};
    json.scripts['release:prepare'] = 'shipjs prepare';
    json.scripts['release:trigger'] = 'shipjs trigger';
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  });
