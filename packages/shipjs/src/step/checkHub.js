import { silentExec } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from './runStep';

export default () =>
  runStep(
    {
      title: 'Checking if `hub` exists.',
    },
    ({ print, error, exitProcess }) => {
      const exists = silentExec('hub --version').code === 0;
      if (!exists) {
        print(error('You need to install `hub` first.'));
        print('  > https://github.com/github/hub#installation');
        exitProcess(1);
      }
    }
  );
