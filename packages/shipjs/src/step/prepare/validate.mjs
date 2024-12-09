import {
  isWorkingTreeClean,
  getCurrentVersion,
  getCurrentBranch,
} from 'shipjs-lib';
import runStep from '../runStep.mjs';
import { print, exitProcess } from '../../util/index.mjs';
import { info, error } from '../../color.mjs';

export default ({ config, dir }) =>
  runStep(
    {
      title: 'Checking the current status.',
    },
    () => {
      const { monorepo } = config;
      const currentVersion =
        monorepo && monorepo.mainVersionFile
          ? getCurrentVersion(dir, monorepo.mainVersionFile)
          : getCurrentVersion(dir);
      if (!isWorkingTreeClean(dir)) {
        print(error('Failed to prepare a release.'));
        print(info('  - The working tree is not clean.'));
        exitProcess(1);
      }
      const baseBranch = getCurrentBranch(dir);
      return { currentVersion, baseBranch };
    }
  );
