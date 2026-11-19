import { getNextVersion, getCommitTitles, getCommitBodies } from 'shipjs-lib';

import { error, info, warning } from '../../color.js';
import { print, exitProcess } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({
  config,
  revisionRange,
  currentVersion,
  prerelease,
  graduate = false,
  dir,
}) =>
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
        prerelease,
        graduate,
      });
    } else {
      let result;
      try {
        result = getNextVersion(revisionRange, currentVersion, dir, {
          preid: prerelease ? prerelease.preid : undefined,
          graduate,
        });
      } catch (err) {
        print(error(err.message));
        exitProcess(1);
        return {};
      }
      const { version, ignoredMessages = [] } = result;
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
