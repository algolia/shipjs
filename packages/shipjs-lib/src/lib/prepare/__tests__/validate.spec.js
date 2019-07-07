import validate from '../validate';
import isWorkingTreeClean from '../../git/isWorkingTreeClean';
import currentBranch from '../../git/currentBranch';
import { BASE_BRANCH } from '../../const';
jest.mock('../../git/isWorkingTreeClean');
jest.mock('../../git/currentBranch');

const defaultOpts = {
  baseBranch: BASE_BRANCH,
};

describe('Validate', () => {
  beforeEach(() => {
    isWorkingTreeClean.mockImplementation(() => true);
    currentBranch.mockImplementation(() => 'master');
  });

  it('returns error if working tree is not clean', () => {
    isWorkingTreeClean.mockImplementation(() => false);
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchInlineSnapshot(`"working_tree_not_clean"`);
  });

  it('does not return error if working tree is clean', () => {
    isWorkingTreeClean.mockImplementation(() => true);
    const result = validate(defaultOpts);
    expect(result).toBe(true);
  });

  it('returns error if current branch is not correct', () => {
    currentBranch.mockImplementation(() => 'aaa');
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchInlineSnapshot(`"current_branch_incorrect"`);
  });

  it('does not return error if current branch is correct', () => {
    currentBranch.mockImplementation(() => 'master');
    const result = validate(defaultOpts);
    expect(result).toBe(true);
  });

  it('returns more than one error', () => {
    isWorkingTreeClean.mockImplementation(() => false);
    currentBranch.mockImplementation(() => 'aaa');
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toMatchInlineSnapshot(`"working_tree_not_clean"`);
    expect(result[1]).toMatchInlineSnapshot(`"current_branch_incorrect"`);
  });
});
