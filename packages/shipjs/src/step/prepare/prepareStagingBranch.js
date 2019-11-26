import { hasLocalBranch, hasRemoteBranch } from 'shipjs-lib';
import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { error } from '../../color';

export default ({ config, nextVersion, releaseType, dir }) =>
  runStep({ title: 'Preparing a staging branch' }, () => {
    const { getStagingBranchName, remote } = config;
    const stagingBranch = getStagingBranchName({ nextVersion, releaseType });
    if (hasLocalBranch(stagingBranch, dir)) {
      print(error(`The branch "${stagingBranch}" already exists locally.`));
      print('Delete the local branch and try again. For example,');
      print(`  $ git branch -d ${stagingBranch}`);
      exitProcess(1);
    }
    if (hasRemoteBranch(remote, stagingBranch, dir)) {
      print(error(`The branch "${stagingBranch}" already exists remotely.`));
      print('Delete the remote branch and try again. For example,');
      print(`  $ git push ${remote} :${stagingBranch}`);
      exitProcess(1);
    }
    return { stagingBranch };
  });
