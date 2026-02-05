import { statSync, readdirSync, existsSync } from 'fs';
import { resolve, join, sep } from 'path';

const isDirectory = (dir) => statSync(dir).isDirectory();
const getDirectories = (dir) =>
  readdirSync(dir)
    .map((name) => join(dir, name))
    .filter(isDirectory);
const hasPackageJson = (dir) => existsSync(`${dir}/package.json`);
const flatten = (arr) => arr.reduce((acc, item) => acc.concat(item), []);

export default function expandPackageList(list, dir = '.') {
  const exclusions = list
    .filter((item) => item.startsWith('!'))
    .map((item) => resolve(dir, item.slice(1)));

  const inclusions = list.filter((item) => !item.startsWith('!'));

  const expandedInclusions = flatten(
    inclusions.map((item) => {
      const partIndex = item
        .split(sep)
        .findIndex((part) => part.startsWith('@(') && part.endsWith(')'));
      if (partIndex !== -1) {
        const parts = item.split(sep);
        const part = parts[partIndex];
        const newList = part
          .slice(2, part.length - 1)
          .split('|')
          .map((subPart) => {
            const newParts = [...parts];
            newParts[partIndex] = subPart;
            return newParts.join(sep);
          });
        return expandPackageList(newList, dir);
      }

      if (item.endsWith('/*')) {
        const basePath = resolve(dir, item.slice(0, item.length - 2));
        return expandPackageList(getDirectories(basePath), dir);
      }
      return resolve(dir, item);
    })
  ).filter(hasPackageJson);

  return expandedInclusions.filter((pkg) => !exclusions.includes(pkg));
}
