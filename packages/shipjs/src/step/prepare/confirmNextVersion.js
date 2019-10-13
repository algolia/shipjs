import inquirer from 'inquirer';
import runStep from '../runStep';
import { print } from '../../util';
import { info } from '../../color';

export default async ({ yes, currentVersion, nextVersion, dryRun }) =>
  await runStep({ title: 'Confirming the next version.' }, async () => {
    print(`The current version: ${currentVersion}`);
    print(`The next version: ${info(nextVersion)}`);
    if (yes || dryRun) {
      return nextVersion;
    }
    const { correct } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'correct',
        message: 'Is this next version correct?',
        default: true,
      },
    ]);
    if (correct) {
      return nextVersion;
    } else {
      const { userTypedVersion } = await inquirer.prompt([
        {
          type: 'input',
          name: 'userTypedVersion',
          message: 'What is the next version?',
          default: nextVersion,
        },
      ]);
      return userTypedVersion;
    }
  });
