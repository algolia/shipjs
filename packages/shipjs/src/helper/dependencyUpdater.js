import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { print } from '../util';
import { runPrettier } from '../helper';

const typesOfDependencies = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
];

export function getListToUpdate(_nextVersion, list) {
  const packageNames = list.map(({ json }) => json.name);

  return list
    .map(({ packagePath, json }) => {
      const updates = typesOfDependencies
        .map((dependencyType) => {
          let dependenciesToUpdate = Object.keys(
            json[dependencyType] || {}
          ).filter((dependency) => packageNames.includes(dependency));

          dependenciesToUpdate = dependenciesToUpdate
            .map((dependencyToUpdate) => {
              const currentVersion = json[dependencyType][dependencyToUpdate];
              const prefix =
                currentVersion.startsWith('~') || currentVersion.startsWith('^')
                  ? currentVersion[0]
                  : '';
              const nextVersion = `${prefix}${_nextVersion}`;
              if (currentVersion !== nextVersion) {
                return {
                  dependency: dependencyToUpdate,
                  currentVersion,
                  nextVersion,
                };
              } else {
                return null;
              }
            })
            .filter(Boolean);

          if (dependenciesToUpdate.length === 0) {
            return null;
          } else {
            return {
              type: dependencyType,
              dependenciesToUpdate,
            };
          }
        })
        .filter(Boolean);

      if (updates.length === 0) {
        return null;
      } else {
        return {
          packagePath,
          name: json.name,
          updates: updates.reduce((acc, { type, dependenciesToUpdate }) => {
            // eslint-disable-next-line no-param-reassign
            acc[type] = dependenciesToUpdate;
            return acc;
          }, {}),
        };
      }
    })
    .filter(Boolean);
}

export function printListToUpdate(list) {
  list.forEach(({ name, packagePath, updates }) => {
    print(`  package: ${name} (${packagePath}}/package.json)`);
    Object.keys(updates).forEach((dependencyType) => {
      print(`    ${dependencyType}:`);
      updates[dependencyType].forEach(
        ({ dependency, currentVersion, nextVersion }) => {
          print(`      ${dependency}: ${currentVersion} -> ${nextVersion}`);
        }
      );
    });
  });
}

export async function runUpdates(list) {
  list.forEach(({ name, packagePath, updates }) => {
    print(`  package: ${name} (${packagePath}}/package.json)`);
    const filePath = resolve(packagePath, 'package.json');
    const json = JSON.parse(readFileSync(filePath).toString());
    Object.keys(updates).forEach((dependencyType) => {
      print(`    ${dependencyType}:`);
      updates[dependencyType].forEach(
        ({ dependency, currentVersion, nextVersion }) => {
          print(`      ${dependency}: ${currentVersion} -> ${nextVersion}`);
          json[dependencyType][dependency] = nextVersion;
        }
      );
    });
    writeFileSync(filePath, JSON.stringify(json, null, 2));
  });

  await Promise.all(
    list.map(({ packagePath }) =>
      runPrettier({
        filePath: resolve(packagePath, 'package.json'),
        dir: packagePath,
      })
    )
  );
}

export function prepareJsons(packageList) {
  return packageList.map((packagePath) => ({
    packagePath,
    json: JSON.parse(
      readFileSync(resolve(packagePath, 'package.json')).toString()
    ),
  }));
}
