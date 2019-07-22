import getBranchNameToMergeBack from '../getBranchNameToMergeBack';

describe('getBranchNameToMergeBack', () => {
  it('gets the same name', () => {
    const mergeStrategy = {
      toSameBranch: ['abc'],
      toReleaseBranch: {},
    };
    const currentBranch = 'abc';
    expect(getBranchNameToMergeBack({ mergeStrategy, currentBranch })).toBe(
      currentBranch
    );
  });

  it('gets the base branch name', () => {
    const mergeStrategy = {
      toSameBranch: [],
      toReleaseBranch: {
        master: 'releases/stable',
      },
    };
    const currentBranch = 'releases/stable';
    expect(getBranchNameToMergeBack({ mergeStrategy, currentBranch })).toBe(
      'master'
    );
  });
});
