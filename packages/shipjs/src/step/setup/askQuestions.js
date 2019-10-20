import inquirer from 'inquirer';
import { getRemoteBranches } from 'shipjs-lib';
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
    const branches = getRemoteBranches(dir);
    const baseBranchCandidate = ['develop', 'dev', 'master'].find(item =>
      branches.includes(item)
    );
    const releaseBranchCandidate = ['releases', 'release', 'master'].find(
      item => branches.includes(item)
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
    console.log({ baseBranch, releaseBranch });
  });
