import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export default function updateVersion(packageJsons, nextVersion, dir = '.') {
  packageJsons.forEach(packageJson => {
    const filePath = resolve(dir, packageJson);
    const json = JSON.parse(readFileSync(filePath).toString());
    json.version = nextVersion;
    writeFileSync(filePath, JSON.stringify(json, null, 2));
  });
}
