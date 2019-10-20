import inquirer from 'inquirer';
import { getRemoteBranches } from 'shipjs-lib';
import fs from 'fs';
import path from 'path';
import runStep from '../runStep';
import { run } from '../../util';
import { info, reset } from '../../color';

const formatMessage = (message, description = '') =>
  [
    message,
    ...description
      .trim()
      .split('\n')
      .map(line => `  ${reset(info(line.trim()))}`),
  ].join('\n');

export default async ({ dir }) =>
  await runStep({}, async () => {
    const { baseBranch, releaseBranch } = await askBranches(dir);
    const { configureCircleCI, scheduleCircleCI, cronExpr } = await askCircleCI(
      dir
    );
    askMonorepo();
    return {
      baseBranch,
      releaseBranch,
      configureCircleCI,
      scheduleCircleCI,
      cronExpr,
    };
  });

async function askBranches(dir) {
  const branches = getRemoteBranches(dir);
  const baseBranchCandidate = ['develop', 'dev', 'master'].find(item =>
    branches.includes(item)
  );
  const releaseBranchCandidate = ['releases', 'release', 'master'].find(item =>
    branches.includes(item)
  );
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

async function askCircleCI(dir) {
  const circleCIAlreadyExists = fs.existsSync(
    path.resolve(dir, '.circleci/config.yml')
  );
  const { configureCircleCI } = await inquirer.prompt(
    [
      !circleCIAlreadyExists
        ? {
            type: 'confirm',
            name: 'configureCircleCI',
            message: 'Configure CircleCI?',
            default: true,
          }
        : undefined,
    ].filter(Boolean)
  );
  const { scheduleCircleCI } = await inquirer.prompt(
    [
      configureCircleCI
        ? {
            type: 'confirm',
            name: 'scheduleCircleCI',
            message: 'Schedule your release via CircleCI?',
            default: true,
          }
        : undefined,
    ].filter(Boolean)
  );
  const offset = new Date().getTimezoneOffset() / 60;
  const hour = 11 + offset;
  const tuesday = 2;
  const defaultCronExpr = `0 ${hour} * * ${tuesday}`;
  const { cronExpr } = await inquirer.prompt(
    [
      scheduleCircleCI
        ? {
            type: 'input',
            name: 'cronExpr',
            message: formatMessage(
              'When to release?',
              'To learn about cron expressions, visit https://crontab.guru/\nThe default value ("Every Tuesday 11am")'
            ),
            default: defaultCronExpr,
          }
        : undefined,
    ].filter(Boolean)
  );

  return {
    configureCircleCI,
    scheduleCircleCI,
    cronExpr,
  };
}

function askMonorepo() {}
