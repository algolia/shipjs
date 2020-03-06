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
  dryRun,
}) =>
  await runStep(
    {
      title: 'Validating preparation conditions.',
      skipIf: () => config.shouldPrepare === undefined,
    },
    async () => {
      const { shouldPrepare } = config;
      if (dryRun) {
        print(`-> execute ${info('shouldPrepare()')} callback.`);
        return;
      }
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
