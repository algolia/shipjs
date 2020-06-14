import inquirer from 'inquirer';
import { getRemoteBranches, getCurrentBranch } from 'shipjs-lib';
import fs from 'fs';
import path from 'path';
import formatMessage from './formatMessage';
import integrations from './CI';
import runStep from '../runStep';

export default async ({ dir }) =>
  await runStep({}, async () => {
    const { baseBranch } = await askBranches(dir);
    const { ciIntegration, ciConfig } = await askCI(dir);
    const {
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
    } = await askMonorepo(dir);

    const { isScoped, isPublic } = await askPackageAccess(dir);

    return {
      baseBranch,
      ciIntegration,
      ciConfig,
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
      isScoped,
      isPublic,
    };
  });

async function askBranches(dir) {
  let remoteBranches = getRemoteBranches(dir);
  let baseBranchCandidate = ['develop', 'dev', 'master', 'main'].find((item) =>
    remoteBranches.includes(item)
  );
  if (remoteBranches.length === 0) {
    const currentBranch = getCurrentBranch(dir);
    remoteBranches = [currentBranch];
    baseBranchCandidate = currentBranch;
  }
  const { baseBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'baseBranch',
      choices: remoteBranches,
      message: formatMessage(
        'What is your base branch?',
        'This is also called "Default branch".\nYou usually merge pull-requests into this branch.'
      ),
      default: baseBranchCandidate,
    },
  ]);
  return { baseBranch };
}

async function askCI() {
  const choices = integrations.map((config) => config.name);
  const { ciTypeText } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ciTypeText',
      message: 'Which CI configure?',
      choices,
    },
  ]);

  const ciIntegration = integrations[choices.indexOf(ciTypeText)];
  const ciConfig = await ciIntegration.askQuestions();

  return { ciIntegration, ciConfig };
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
          'For example,',
          '  - packagesToBump: ["packages/*", "examples/*"]',
          '  - packagesToPublish: ["packages/*"]',
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

  return {
    useMonorepo,
    mainVersionFile,
    packagesToBump: JSON.parse(packagesToBump),
    packagesToPublish: JSON.parse(packagesToPublish),
  };
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
