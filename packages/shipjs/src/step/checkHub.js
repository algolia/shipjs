import runStep from './runStep';
import { print, exitProcess } from '../util';
import { hubInstalled, hubConfigured } from '../helper';
import { error } from '../color';

export default () =>
  runStep(
    {
      title: 'Checking if `hub` exists.',
    },
    () => {
      if (!hubInstalled()) {
        print(error('You need to install `hub` first.'));
        print(
          '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
        );
        exitProcess(1);
      } else if (!hubConfigured()) {
        print(error('You need to configure `hub`.'));
        print(
          '  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub'
        );
        exitProcess(1);
      }
    }
  );
