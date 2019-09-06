import { resolve, join } from 'path';
import { statSync, readdirSync, existsSync } from 'fs';

const isDirectory = dir => statSync(dir).isDirectory();
const getDirectories = dir =>
  readdirSync(dir)
    .map(name => join(dir, name))
    .filter(isDirectory);
const hasPackageJson = dir => existsSync(`${dir}/package.json`);
const flatten = arr => arr.reduce((acc, item) => acc.concat(item), []);

export default function expandPackageList(list, dir = '.') {
  return flatten(
    list.map(item => {
      if (item.endsWith('/*')) {
        const basePath = resolve(dir, item.slice(0, item.length - 2));
        return getDirectories(basePath).filter(hasPackageJson);
      } else {
        return resolve(dir, item);
      }
    })
  );
}
