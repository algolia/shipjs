import silentExec from '../../shell/silentExec';
import getRemoteBranches from '../getRemoteBranches';
jest.mock('../../shell/silentExec');

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
});
