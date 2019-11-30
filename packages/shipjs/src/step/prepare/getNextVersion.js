import { getNextVersion } from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { info, warning } from '../../color';

export default ({ commitRange, currentVersion, dir }) =>
  runStep({ title: 'Calculating the next version.' }, () => {
    const { version: nextVersion, ignoredMessages = [] } = getNextVersion(
      commitRange,
      currentVersion,
      dir
    );
    if (ignoredMessages.length > 0) {
      print(
        warning('The following commit messages out of convention are ignored:')
      );
      ignoredMessages.forEach(message => print(`  ${message}`));
    }
    if (nextVersion === null) {
      print(info('Nothing to release!'));
      exitProcess(0);
    }
    return { nextVersion };
  });
