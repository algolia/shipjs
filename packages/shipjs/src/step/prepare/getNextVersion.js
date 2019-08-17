import { getNextVersion } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ dir }) =>
  runStep(
    { title: 'Calculating the next version.' },
    ({ print, warning, error, exitProcess }) => {
      const { version: nextVersion, ignoredMessages = [] } = getNextVersion(
        dir
      );
      if (ignoredMessages.length > 0) {
        print(
          warning(
            'The following commit messages out of convention are ignored:'
          )
        );
        ignoredMessages.forEach(message => print(`  ${message}`));
      }
      if (nextVersion === null) {
        print(error('Nothing to release!'));
        exitProcess(1);
      }
      return { nextVersion };
    }
  );
