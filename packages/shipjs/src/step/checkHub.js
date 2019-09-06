import { silentExec } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from './runStep';

export default () =>
  runStep(
    {
      title: 'Checking if `hub` exists.',
    },
    ({ print, error, exitProcess }) => {
      const exists =
        silentExec('hub --version', { ignoreError: true }).code === 0;
      if (!exists) {
        print(error('You need to install `hub` first.'));
        print(
          '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
        );
        exitProcess(1);
      }
      const configured =
        silentExec(
          `yes "" | GITHUB_TOKEN=${process.env.GITHUB_TOKEN} hub api user`,
          { ignoreError: true }
        ).code === 0;
      if (!configured) {
        print(error('You need to configure `hub`.'));
        print(
          '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
        );
        exitProcess(1);
      }
    }
  );
