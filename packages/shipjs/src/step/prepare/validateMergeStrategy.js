import runStep from '../runStep';
import { print, exitProcess } from '../../util';
import { warning, error } from '../../color';

export default ({ config }) =>
  runStep({ title: 'Validating mergeStrategy.' }, () => {
    const { mergeStrategy } = config;
    const releaseBranches = Object.values(mergeStrategy.toReleaseBranch);
    const uniqueReleaseBranches = new Set(releaseBranches);
    const { toSameBranch } = mergeStrategy;
    if (releaseBranches.length !== uniqueReleaseBranches.size) {
      print(error('Invalid `mergeStrategy` in your configuration.'));
      print(error('  : Release branch should be unique per base branch.'));
      print(warning(JSON.stringify(mergeStrategy, null, 2)));
      exitProcess(1);
    } else if (
      new Set([...toSameBranch, ...releaseBranches]).size !==
      toSameBranch.length + releaseBranches.length
    ) {
      print(error('Invalid `mergeStrategy` in your configuration.'));
      print(
        error(
          '  : You cannot put a same branch name both in `toSameBranch` and `toReleaseBranch`'
        )
      );
      exitProcess(1);
    }
  });
