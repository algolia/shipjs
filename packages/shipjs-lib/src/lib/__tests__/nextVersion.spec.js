import silentExec from '../shell/silentExec';
import nextVersion, { nextVersionFromCommitMessages } from '../nextVersion';
import { inc } from 'semver';

describe('nextVersionFromCommitMessages', () => {
  it('gets nextVersionFromCommitMessages with patch updated', () => {
    const version = '0.0.1';
    const titles = `fix: abc
      docs: abc
      style: abc
      refactor: abc
      perf: abc
      test: abc
      chore: abc`;
    const bodies = '';
    const actual = nextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe(inc(version, 'patch'));
  });

  it('gets nextVersionFromCommitMessages with minor updated', () => {
    const version = '0.0.1';
    const titles = `fix: abc
      docs: abc
      style: abc
      refactor: abc
      perf: abc
      test: abc
      chore: abc
      feat: abc`;
    const bodies = '';
    const actual = nextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe(inc(version, 'minor'));
  });

  it('gets nextVersionFromCommitMessages with major updated', () => {
    const version = '0.0.1';
    const titles = `fix: abc
      docs: abc
      style: abc
      refactor: abc
      perf: abc
      test: abc
      chore: abc
      feat: abc`;
    const bodies = 'BREAKING CHANGE: this breaks the previous behavior.';
    const actual = nextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe(inc(version, 'major'));
  });
});

describe('nextVersion', () => {
  it('gets nextVersionFromCommitMessages with patch updated', () => {
    silentExec('./tests/bootstrap-examples/patch-version-up.sh');
    const actual = nextVersion('sandbox/patch-version-up');
    expect(actual).toBe('0.0.2');
  });

  it('gets nextVersionFromCommitMessages with minor updated', () => {
    silentExec('./tests/bootstrap-examples/minor-version-up.sh');
    const actual = nextVersion('sandbox/minor-version-up');
    expect(actual).toBe('0.1.0');
  });

  it('gets nextVersionFromCommitMessages with major updated', () => {
    silentExec('./tests/bootstrap-examples/major-version-up.sh');
    const actual = nextVersion('sandbox/major-version-up');
    expect(actual).toBe('1.0.0');
  });
});
