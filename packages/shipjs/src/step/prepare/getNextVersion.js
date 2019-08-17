import { getNextVersion } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ dir }) =>
  runStep(
    { title: 'Calculating the next version.' },
    ({ print, error, exitProcess }) => {
      const nextVersion = getNextVersion(dir);
      if (nextVersion === null) {
        print(error('Nothing to release!'));
        exitProcess(1);
      }
      return { nextVersion };
    }
  );
