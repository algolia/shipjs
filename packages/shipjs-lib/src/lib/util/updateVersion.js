import { readFileSync, writeFileSync } from 'fs';

export default function updateVersion(packageJsons, nextVersion) {
  packageJsons.forEach(packageJson => {
    const json = JSON.parse(readFileSync(packageJson).toString());
    json.version = nextVersion;
    writeFileSync(packageJson, JSON.stringify(json, null, 2));
  });
}
