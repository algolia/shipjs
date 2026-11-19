import fs from 'fs';
import path from 'path';

import { expandPackageList } from 'shipjs-lib';

function readPackage(dir) {
  const filePath = path.resolve(dir, 'package.json');
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const {
    name,
    version,
    private: isPrivate,
  } = JSON.parse(fs.readFileSync(filePath).toString());
  if (isPrivate || !name || !version) {
    return null;
  }
  return { name, version, dir };
}

// `[{ name, version }]` of the packages `shipjs trigger` is about to publish.
export default async function getPackagesToPublish({ config, dir }) {
  if (typeof config.getPackagesToPublish === 'function') {
    return (await config.getPackagesToPublish({ dir })) || [];
  }
  const dirs = config.monorepo
    ? expandPackageList(config.monorepo.packagesToPublish, dir)
    : [dir];
  return dirs.map(readPackage).filter(Boolean);
}
