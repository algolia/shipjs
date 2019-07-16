import silentExec from '../../shell/silentExec';
import getNextVersion, {
  getNextVersionFromCommitMessages,
} from '../getNextVersion';
import { inc } from 'semver';

describe('getNextVersionFromCommitMessages', () => {
  it('getNextVersionFromCommitMessages with patch updated', () => {
    const version = '1.2.3';
    const titles = `fix: abc
      docs: abc
      style: abc
      refactor: abc
      perf: abc
      test: abc
      chore: abc`;
    const bodies = '';
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe('1.2.4');
  });

  it('getNextVersionFromCommitMessages of scoped commits with patch updated', () => {
    const version = '1.2.3';
    const titles = `fix(a): abc
      docs(ab): abc
      style(abc): abc
      refactor(abcd): abc
      perf(abcde): abc
      test(abcdef): abc
      chore(abcdefg): abc`;
    const bodies = '';
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe('1.2.4');
  });

  it('getNextVersionFromCommitMessages with minor updated', () => {
    const version = '1.2.3';
    const titles = `fix(a): abc
      docs(ab): abc
      style(abc): abc
      refactor(abcd): abc
      perf(abcde): abc
      test(abcdef): abc
      chore(abcdefg): abc
      feat(abcdefgh): abc`;
    const bodies = '';
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe('1.3.0');
  });

  it('getNextVersionFromCommitMessages of scoped commits with minor updated', () => {
    const version = '1.2.3';
    const titles = `fix: abc
      docs: abc
      style: abc
      refactor: abc
      perf: abc
      test: abc
      chore: abc
      feat: abc`;
    const bodies = '';
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe('1.3.0');
  });

  it('getNextVersionFromCommitMessages with major updated', () => {
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
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe('1.0.0');
  });

  it('gets a null with no commit messages', () => {
    const version = '0.0.1';
    const titles = '';
    const bodies = '';
    const actual = getNextVersionFromCommitMessages(version, titles, bodies);
    expect(actual).toBe(null);
  });

  it('throws when there is a commit message out of convention', () => {
    const version = '0.0.1';
    const titles = `hello: abc`;
    const bodies = '';
    expect(() => {
      getNextVersionFromCommitMessages(version, titles, bodies);
    }).toThrow();
  });

  it('increases version with postfixes', () => {
    const list = ['alpha', 'beta', 'rc', 'canary', 'whatever'];
    list.forEach(tag => {
      const version = `0.0.1-${tag}.123`;
      // Even if there is a `feat` commit, it still increases the number only.
      const titles = `fix: abc
        docs: abc
        style: abc
        refactor: abc
        perf: abc
        test: abc
        chore: abc
        feat: abc`;
      const bodies = '';
      const actual = getNextVersionFromCommitMessages(version, titles, bodies);
      expect(actual).toBe(`0.0.1-${tag}.124`);
    });
  });
});

describe('getNextVersion', () => {
  it('gets next version with patch updated', () => {
    silentExec('./tests/bootstrap-examples/patch-version-up.sh');
    const actual = getNextVersion('sandbox/patch-version-up');
    expect(actual).toBe('0.0.2');
  });

  it('gets next version with minor updated', () => {
    silentExec('./tests/bootstrap-examples/minor-version-up.sh');
    const actual = getNextVersion('sandbox/minor-version-up');
    expect(actual).toBe('0.1.0');
  });

  it('gets next version with major updated', () => {
    silentExec('./tests/bootstrap-examples/major-version-up.sh');
    const actual = getNextVersion('sandbox/major-version-up');
    expect(actual).toBe('1.0.0');
  });

  it('gets a null with no commit messages', () => {
    silentExec('./tests/bootstrap-examples/empty.sh no-commit-log');
    const actual = getNextVersion('sandbox/no-commit-log');
    expect(actual).toBe(null);
  });

  it('throws when there is a commit message out of convention', () => {
    silentExec('./tests/bootstrap-examples/out-of-convention.sh');
    expect(() => {
      getNextVersion('sandbox/out-of-convention');
    }).toThrow();
  });
});
