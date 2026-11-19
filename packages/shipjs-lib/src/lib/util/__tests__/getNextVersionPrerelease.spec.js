import { getNextVersionFromCommitMessages } from '../getNextVersion.js';

const next = (version, titles, bodies, preid) =>
  getNextVersionFromCommitMessages(version, titles, bodies, { preid }).version;

describe('getNextVersionFromCommitMessages with a preid', () => {
  it('enters a channel with the bump the commits ask for', () => {
    expect(next('4.80.0', 'fix: abc', '', 'beta')).toBe('4.80.1-beta.0');
    expect(next('4.80.0', 'feat: abc', '', 'beta')).toBe('4.81.0-beta.0');
    expect(next('4.80.0', 'feat!: abc', '', 'beta')).toBe('5.0.0-beta.0');
    expect(next('4.80.0', 'feat: abc', 'BREAKING CHANGE: abc', 'beta')).toBe(
      '5.0.0-beta.0'
    );
  });

  it('increments on the same channel', () => {
    expect(next('5.0.0-beta.0', 'feat!: abc', '', 'beta')).toBe('5.0.0-beta.1');
    expect(next('5.0.0-beta.1', 'fix: abc', '', 'beta')).toBe('5.0.0-beta.2');
  });

  it('moves to a later channel', () => {
    expect(next('5.0.0-beta.3', 'fix: abc', '', 'rc')).toBe('5.0.0-rc.0');
  });

  it('refuses to move to an earlier channel', () => {
    expect(() => next('5.0.0-rc.0', 'fix: abc', '', 'beta')).toThrow(
      /not greater than/
    );
  });

  it('returns null without commits', () => {
    expect(next('5.0.0-beta.0', '', '', 'beta')).toBeNull();
    expect(next('4.80.0', '', '', 'beta')).toBeNull();
  });

  it('keeps the previous behaviour without a preid', () => {
    expect(next('5.0.0-beta.0', '', '', undefined)).toBe('5.0.0-beta.1');
    expect(next('4.80.0', 'feat: abc', '', undefined)).toBe('4.81.0');
    expect(next('4.80.0', 'feat!: abc', '', undefined)).toBe('5.0.0');
    expect(next('4.80.0', '', '', undefined)).toBeNull();
  });
});
