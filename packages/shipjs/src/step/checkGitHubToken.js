import runStep from './runStep';
import { print, exitProcess } from '../util';
import { error } from '../color';

export default ({ dryRun }) =>
  runStep({ title: 'Checking GITHUB_TOKEN' }, () => {
    if (process.env.GITHUB_TOKEN) {
      return;
    }
    print(
      error('You need to specify GITHUB_TOKEN as an environment variable.')
    );
    print('create a token with `repo` or `public_repo` permissions here:');
    print('https://github.com/settings/tokens');
    print('  1. GITHUB_TOKEN=xxx shipjs ...');
    print('     or');
    print('  2. Create a file named ".env" and put the following content:');
    print('     GITHUB_TOKEN=xxx');
    print('     (".env" should not be committed. Add it to ".gitignore".)');
    if (!dryRun) {
      exitProcess(1);
    }
  });
