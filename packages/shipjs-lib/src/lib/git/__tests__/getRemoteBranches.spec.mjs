import silentExec from '../../shell/silentExec.mjs';
import getRemoteBranches from '../getRemoteBranches.mjs';
jest.mock('../../shell/silentExec.mjs');

describe('getRemoteBranches', () => {
  it('works', () => {
    silentExec
      .mockImplementationOnce(() => 'origin')
      .mockImplementationOnce(
        () => `  origin/HEAD -> origin/master
      origin/chore/all-contributors
      origin/master
      origin/renovate/pin-dependencies
      origin/renovate/rollup-1.x
    `
      );
    const result = getRemoteBranches();
    expect(result).toEqual([
      'chore/all-contributors',
      'master',
      'renovate/pin-dependencies',
      'renovate/rollup-1.x',
    ]);
  });

  it('works with multiple origins', () => {
    silentExec
      .mockImplementationOnce(() => 'origin\norigin2')
      .mockImplementationOnce(
        () => `  origin/HEAD -> origin/master
      origin/chore/all-contributors
      origin/master
      origin/renovate/pin-dependencies
      origin/renovate/rollup-1.x
      origin2/fix/something
      origin2/chore/test
    `
      );
    const result = getRemoteBranches();
    expect(result).toEqual([
      'chore/all-contributors',
      'master',
      'renovate/pin-dependencies',
      'renovate/rollup-1.x',
      'fix/something',
      'chore/test',
    ]);
  });
});
