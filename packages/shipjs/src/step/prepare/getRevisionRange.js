import inquirer from 'inquirer';
import { hasTag, silentExec } from 'shipjs-lib';
import runStep from '../runStep';
import { print } from '../../util';
import { info, warning } from '../../color';

export default async ({ currentVersion, dir }) =>
  await runStep(
    { title: 'Getting a revision range for this release.' },
    async () => {
      let revisionRange = `v${currentVersion}..HEAD`;
      if (hasTag(`v${currentVersion}`, dir)) {
        print(info(`  ${revisionRange}`));
        return { revisionRange };
      }

      print(warning(`Git tag 'v${currentVersion}' doesn't exist.`));
      const commits = silentExec(`git log --pretty=format:"%h%d %s"`, {
        dir,
      })
        .toString()
        .split('\n');
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
