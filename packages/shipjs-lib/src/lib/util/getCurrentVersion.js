import fs from 'fs';
import path from 'path';
import { PACKAGE_JSON } from '../const';

export default function getCurrentVersion(dir = '.') {
  const { version } = JSON.parse(
    fs.readFileSync(path.resolve(dir, PACKAGE_JSON))
  );
  return version;
}
