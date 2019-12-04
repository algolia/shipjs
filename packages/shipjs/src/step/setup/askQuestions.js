import inquirer from 'inquirer';
import { getRemoteBranches } from 'shipjs-lib';
import fs from 'fs';
import path from 'path';
import formatMessage from './formatMessage';
import integrations from './CI';
import runStep from '../runStep';

export default async ({ dir }) =>
  await runStep({}, async () => {
    const { baseBranch, releaseBranch } = await askBranches(dir);
    const { CIIndex, CIConfig } = await askCI(dir);
    const {
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
    } = await askMonorepo(dir);

    const { isScoped, isPublic } = await askPackageAccess(dir);

    return {
      baseBranch,
      releaseBranch,
      CIIndex,
      CIConfig,
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
      isScoped,
      isPublic,
    };
  });

async function askBranches(dir) {
  let branches = getRemoteBranches(dir);
  let baseBranchCandidate = ['develop', 'dev', 'master'].find(item =>
    branches.includes(item)
  );
  let releaseBranchCandidate = ['releases', 'release', 'master'].find(item =>
    branches.includes(item)
  );
  if (branches.length === 0) {
    branches = ['master'];
    baseBranchCandidate = 'master';
    releaseBranchCandidate = 'master';
  }
  const { baseBranch, releaseBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'baseBranch',
      choices: branches,
      message: formatMessage(
        'What is your base branch?',
        'This is also called "Default branch".\nYou usually merge pull-requests into this branch.'
      ),
      default: baseBranchCandidate,
    },
    {
      type: 'list',
      name: 'releaseBranch',
      choices: branches,
      message: formatMessage(
        'What is your release branch?',
        "If you maintain a branch where you keep latest release, choose the branch.\nIf you don't, choose your base branch."
      ),
      default: releaseBranchCandidate,
    },
  ]);
  return { baseBranch, releaseBranch };
}

async function askCI() {
  const choices = integrations.map(config => config.name);
  const { CITypeText } = await inquirer.prompt([
    {
      type: 'list',
      name: 'CITypeText',
      message: 'Which CI configure?',
      choices,
    },
  ]);

  const CIIndex = choices.indexOf(CITypeText);
  const CIConfig = await integrations[CIIndex].askQustions();

  return { CIIndex, CIConfig };
}

async function askMonorepo(dir) {
  if (!detectMonorepo(dir)) {
    return {};
  }

  const { useMonorepo } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useMonorepo',
      message: 'Setup a config for your monorepo?',
      default: true,
    },
  ]);

  if (!useMonorepo) {
    return { useMonorepo };
  }

  const mainVersionFileCandidate = getMainVersionFileCandidate(dir);
  const packagesCandidate = getMonorepoPackages(dir);

  const {
    mainVersionFile,
    packagesToBump,
    packagesToPublish,
  } = await inquirer.prompt([
    {
      type: 'input',
      name: 'mainVersionFile',
      message: 'What is your main version file?',
      default: mainVersionFileCandidate,
    },
    {
      type: 'input',
      name: 'packagesToBump',
      message: formatMessage(
        'packagesToBump?',
        [
          'What are your packages that you want to bump version of?',
          packagesCandidate
            ? ''
            : 'It should be an array of strings, for example: ["packages/*"]',
        ]
          .filter(Boolean)
          .join('\n')
      ),
      validate: stringArrayValidator,
      default: packagesCandidate ? JSON.stringify(packagesCandidate) : '',
    },
    {
      type: 'input',
      name: 'packagesToPublish',
      message: formatMessage(
        'packagesToPublish',
        [
          'What are your packages that you want to publish?',
          'Among packagesToBump, there can be some packages you do not want to publish.',
          'For example, while you have ["packages/*", "examples/*"] as packagesToBump,',
          'you can have ["packages/*"] as packagesToPublish.',
          packagesCandidate
            ? ''
            : 'It should be an array of strings, for example: ["packages/*"]',
        ]
          .filter(Boolean)
          .join('\n')
      ),
      validate: stringArrayValidator,
      default: packagesCandidate ? JSON.stringify(packagesCandidate) : '',
    },
  ]);

  return { useMonorepo, mainVersionFile, packagesToBump, packagesToPublish };
}

async function askPackageAccess(dir) {
  const isScoped = isScopedPackage(getJson(dir, 'package.json').name);

  if (!isScoped) {
    return { isScoped };
  }

  const { isPublic } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isPublic',
      message: 'Publish public package?',
      default: true,
    },
  ]);

  return { isScoped, isPublic };
}

function detectMonorepo(dir) {
  if (fs.existsSync(path.resolve(dir, 'lerna.json'))) {
    return true;
  }

  if (getJson(dir, 'package.json').workspaces) {
    return true;
  }

  return false;
}

function getMainVersionFileCandidate(dir) {
  const versionInLernaJsonExists =
    typeof getJson(dir, 'lerna.json').version === 'string';
  if (versionInLernaJsonExists) return 'lerna.json';

  if (typeof getJson(dir, 'package.json').version === 'string') {
    return 'package.json';
  }

  return undefined;
}

function getMonorepoPackages(dir) {
  const lernaPackages = getJson(dir, 'lerna.json').packages;
  if (Array.isArray(lernaPackages)) {
    return lernaPackages;
  }

  const packageJson = getJson(dir, 'package.json');
  if (Array.isArray(packageJson.workspaces)) {
    return packageJson.workspaces;
  } else if (
    typeof packageJson.workspaces === 'object' &&
    Array.isArray(packageJson.workspaces.packages)
  ) {
    return packageJson.workspaces.packages;
  }

  if (fs.existsSync(path.resolve(dir, 'packages'))) {
    return ['packages/*'];
  }

  return undefined;
}

function getJson(dir, fileName) {
  const filePath = path.resolve(dir, fileName);
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath).toString())
    : {};
}

function stringArrayValidator(answer) {
  const errorMessage = 'It is not a valid array of strings.';
  try {
    const json = JSON.parse(answer);
    return Array.isArray(json) ? true : errorMessage;
  } catch (e) {
    return errorMessage;
  }
}

function isScopedPackage(name) {
  try {
    return name[0] === '@' && name.indexOf('/') !== -1;
  } catch (err) {
    return false;
  }
}
