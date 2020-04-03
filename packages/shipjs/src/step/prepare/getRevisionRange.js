import inquirer from 'inquirer';
import { hasTag, silentExec } from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { info, warning, error } from '../../color';

export default async ({ yes, commitFrom, currentTag, dir }) =>
  await runStep(
    { title: 'Getting a revision range for this release.' },
    async () => {
      if (commitFrom) {
        return {
          revisionRange: `${commitFrom}..HEAD`,
        };
      }

      let revisionRange = `${currentTag}..HEAD`;
      if (hasTag(currentTag, dir)) {
        print(info(`  ${revisionRange}`));
        return { revisionRange };
      }

      const tagNotExistingMessage = `Git tag '${currentTag}' doesn't exist.`;
      if (yes) {
        print(error(tagNotExistingMessage));
        print(
          info(
            'Ship.js cannot figure out from which commit you want to release.'
          )
        );
        print(info('Try again with the following option added:'));
        print(info('  --commit-from SHA'));
        exitProcess(1);
      }

      print(warning(tagNotExistingMessage));
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
          message: 'From which commit do you want to release?',
          choices: commits.map((commit, index) => `${index + 1}) ${commit}`),
        },
      ]);
      const [, commit] = answer.split(' ');

      revisionRange = `${commit}..HEAD`;
      print(info(`  ${revisionRange}`));
      return { revisionRange };
    }
  );
