import { getNextVersion, getCommitTitles, getCommitBodies } from 'shipjs-lib';
import runStep from '../runStep.js';
import { print, exitProcess } from '../../util/index.js';
import { info, warning } from '../../color.js';

export default ({ config, revisionRange, currentVersion, dir }) =>
  runStep({ title: 'Calculating the next version.' }, () => {
    let nextVersion;
    if (typeof config.getNextVersion === 'function') {
      const commitTitles = getCommitTitles(revisionRange, dir);
      const commitBodies = getCommitBodies(revisionRange, dir);
      nextVersion = config.getNextVersion({
        revisionRange,
        commitTitles,
        commitBodies,
        currentVersion,
        dir,
      });
    } else {
      const { version, ignoredMessages = [] } = getNextVersion(
        revisionRange,
        currentVersion,
        dir
      );
      if (ignoredMessages.length > 0) {
        print(
          warning(
            'The following commit messages out of convention are ignored:'
          )
        );
        ignoredMessages.forEach((message) => print(`  ${message}`));
      }
      nextVersion = version;
    }
    if (nextVersion === null) {
      print(info('Nothing to release!'));
      exitProcess(0);
    }
    return { nextVersion };
  });
