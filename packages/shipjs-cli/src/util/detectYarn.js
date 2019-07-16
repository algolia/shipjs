import { resolve } from 'path';
import { existsSync } from 'fs';

export default function detectYarn(dir = '.') {
  return existsSync(resolve(dir, 'yarn.lock'));
}
