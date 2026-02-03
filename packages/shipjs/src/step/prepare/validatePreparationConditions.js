import {
  getReleaseTag,
  getCommitTitles,
  getCommitNumbersPerType,
} from 'shipjs-lib';

import { info } from '../../color.js';
import { print, exitProcess } from '../../util/index.js';
import runStep from '../runStep.js';

export default async ({
  config,
  releaseType,
  nextVersion,
  revisionRange,
  dir,
}) =>
  await runStep(
    {
      title: 'Validating preparation conditions.',
      skipIf: () => config.shouldPrepare === undefined,
    },
    async () => {
      const { shouldPrepare } = config;
      const releaseTag = getReleaseTag(nextVersion);
      const commits = getCommitTitles(revisionRange, dir);
      const { numbers: commitNumbersPerType } =
        getCommitNumbersPerType(commits);

      const result = await shouldPrepare({
        commits,
        nextVersion,
        releaseType,
        releaseTag,
        commitNumbersPerType,
      });
      if (!result) {
        print(
          info('`shouldPrepare` returned false. So the preparation is skipped.')
        );
        exitProcess(0);
      }
    }
  );
