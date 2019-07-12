import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function updateVersion(packageJsons, nextVersion, dir = '.') {
  packageJsons.forEach(packageJson => {
    const json = JSON.parse(readFileSync(resolve(dir, packageJson)).toString());
    json.version = nextVersion;
    writeFileSync(packageJson, JSON.stringify(json, null, 2));
  });
}
