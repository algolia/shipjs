import { getNextVersionFromCommitMessages } from '../getNextVersion.js';

const graduate = (version, titles = '', bodies = '') =>
  getNextVersionFromCommitMessages(version, titles, bodies, { graduate: true })
    .version;

describe('getNextVersionFromCommitMessages with graduate', () => {
  it('releases a prerelease as its stable version', () => {
    expect(graduate('5.0.0-beta.3', 'fix: abc')).toBe('5.0.0');
    expect(graduate('5.0.0-rc.0', 'feat!: abc')).toBe('5.0.0');
    expect(graduate('4.81.0-beta.1', 'feat: abc')).toBe('4.81.0');
    expect(graduate('4.80.1-next.0', 'fix: abc')).toBe('4.80.1');
  });

  it('graduates without new commits', () => {
    expect(graduate('5.0.0-rc.1')).toBe('5.0.0');
  });

  it('refuses a stable version', () => {
    expect(() => graduate('4.80.0', 'feat: abc')).toThrow(
      /it is not a prerelease/
    );
  });

  it('refuses a preid at the same time', () => {
    expect(() =>
      getNextVersionFromCommitMessages('5.0.0-beta.0', 'fix: abc', '', {
        preid: 'beta',
        graduate: true,
      })
    ).toThrow(/cannot be used together/);
  });

  it('keeps incrementing a prerelease without graduate', () => {
    expect(
      getNextVersionFromCommitMessages('5.0.0-beta.0', 'fix: abc', '').version
    ).toBe('5.0.0-beta.1');
  });
});
