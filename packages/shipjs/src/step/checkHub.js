import { silentExec } from 'shipjs-lib';
import runStep from './runStep';
import { print, exitProcess } from '../util';
import { error } from '../color';

export default () =>
  runStep(
    {
      title: 'Checking if `hub` exists.',
    },
    () => {
      const exists =
        silentExec('hub --version', { ignoreError: true }).code === 0;
      if (!exists) {
        print(error('You need to install `hub` first.'));
        print(
          '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
        );
        exitProcess(1);
      } else {
        const token = process.env.GITHUB_TOKEN || '';
        const configured =
          silentExec(`yes "" | GITHUB_TOKEN=${token} hub api user`, {
            ignoreError: true,
          }).code === 0;
        if (!configured) {
          print(error('You need to configure `hub`.'));
          print(
            '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
          );
          exitProcess(1);
        }
      }
    }
  );
