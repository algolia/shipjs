import getDestinationBranchName from '../getDestinationBranchName';

describe('getDestinationBranchName', () => {
  it('gets the same name with the base branch', () => {
    const mergeStrategy = {
      toSameBranch: ['abc'],
      toReleaseBranch: {},
    };
    const baseBranch = 'abc';
    expect(getDestinationBranchName({ baseBranch, mergeStrategy })).toBe(
      baseBranch
    );
  });

  it('gets the release branch name', () => {
    const mergeStrategy = {
      toSameBranch: [],
      toReleaseBranch: {
        abc: 'def',
      },
    };
    const baseBranch = 'abc';
    expect(getDestinationBranchName({ baseBranch, mergeStrategy })).toBe('def');
  });

  it('throws with wrong config', () => {
    const mergeStrategy = {};
    const baseBranch = 'abc';
    expect(() => {
      getDestinationBranchName({ baseBranch, mergeStrategy });
    }).toThrow();
  });
});
