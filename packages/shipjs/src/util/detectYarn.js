import { existsSync } from 'fs';
import { resolve } from 'path';

export default function detectYarn(dir = '.') {
  return existsSync(resolve(dir, 'yarn.lock'));
}
