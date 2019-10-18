import validate from '../validateBeforePrepare';
import { isWorkingTreeClean, getCurrentBranch, hasTag } from 'shipjs-lib';

const defaultOpts = {
  baseBranches: ['master'],
};

describe('Validate', () => {
  beforeEach(() => {
    isWorkingTreeClean.mockImplementation(() => true);
    getCurrentBranch.mockImplementation(() => 'master');
    hasTag.mockImplementation(() => true);
  });

  it('returns error if working tree is not clean', () => {
    isWorkingTreeClean.mockImplementation(() => false);
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchInlineSnapshot(`"workingTreeNotClean"`);
  });

  it('does not return error if working tree is clean', () => {
    isWorkingTreeClean.mockImplementation(() => true);
    const result = validate(defaultOpts);
    expect(result).toBe(true);
  });

  it('returns error if current branch is not correct', () => {
    getCurrentBranch.mockImplementation(() => 'aaa');
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchInlineSnapshot(`"currentBranchIncorrect"`);
  });

  it('does not return error if current branch is correct', () => {
    getCurrentBranch.mockImplementation(() => 'master');
    const result = validate(defaultOpts);
    expect(result).toBe(true);
  });

  it('returns error if there is no git tag for current version', () => {
    hasTag.mockImplementation(() => false);
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toMatchInlineSnapshot(`"noTagForCurrentVersion"`);
  });

  it('does not return error if there is git tag for current version', () => {
    hasTag.mockImplementation(() => true);
    const result = validate(defaultOpts);
    expect(result).toBe(true);
  });

  it('returns more than one error', () => {
    isWorkingTreeClean.mockImplementation(() => false);
    getCurrentBranch.mockImplementation(() => 'aaa');
    hasTag.mockImplementation(() => false);
    const result = validate(defaultOpts);
    expect(result).not.toBe(true);
    expect(result.length).toBe(3);
  });
});
