import { resolve, join, sep } from 'path';
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
      const partIndex = item
        .split(sep)
        .findIndex(part => part.startsWith('@(') && part.endsWith(')'));
      if (partIndex !== -1) {
        const parts = item.split(sep);
        const part = parts[partIndex];
        const newList = part
          .slice(2, part.length - 1)
          .split('|')
          .map(subPart => {
            const newParts = [...parts];
            newParts[partIndex] = subPart;
            return newParts.join(sep);
          });
        return expandPackageList(newList, dir);
      }

      if (item.endsWith('/*')) {
        const basePath = resolve(dir, item.slice(0, item.length - 2));
        return expandPackageList(getDirectories(basePath), dir);
      } else {
        return resolve(dir, item);
      }
    })
  ).filter(hasPackageJson);
}
