import inquirer from 'inquirer';
import { hasTag, silentExec } from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { info, warning, error } from '../../color';

export default async ({ currentVersion, yes, dir }) =>
  await runStep(
    { title: 'Getting a revision range for this release.' },
    async () => {
      let revisionRange = `v${currentVersion}..HEAD`;
      if (hasTag(`v${currentVersion}`, dir)) {
        print(info(`  ${revisionRange}`));
        return { revisionRange };
      }

      const tagNotExistingMessage = `Git tag 'v${currentVersion}' doesn't exist.`;
      const commits = silentExec(`git log --pretty=format:"%h%d %s"`, {
        dir,
      })
        .toString()
        .split('\n');
      if (yes) {
        print(error(tagNotExistingMessage));
        exitProcess(1);
      }

      print(warning(tagNotExistingMessage));
      const { answer } = await inquirer.prompt([
        {
          type: 'list',
          pageSize: 10,
          name: 'answer',
          message: 'Since which commit do you want to release?',
          choices: commits.map((commit, index) => `${index + 1}) ${commit}`),
        },
      ]);
      const [, commit] = answer.split(' ');

      revisionRange = `${commit}..HEAD`;
      print(info(`  ${revisionRange}`));
      return { revisionRange };
    }
  );
