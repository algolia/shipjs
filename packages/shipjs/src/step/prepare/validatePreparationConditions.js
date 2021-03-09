import {
  getReleaseTag,
  getCommitTitles,
  getCommitNumbersPerType,
} from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { info } from '../../color';

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
      const { numbers: commitNumbersPerType } = getCommitNumbersPerType(
        commits
      );

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
