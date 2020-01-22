import getReleaseType from '../getReleaseType';

describe('getReleaseType', () => {
  it('works', () => {
    const list = [
      ['1.2.3', '2.0.0', 'major'],
      ['1.2.3', '1.3.0', 'minor'],
      ['1.2.3', '1.2.4', 'patch'],
      ['1.2.3', '1.2.4-alpha.0', 'prerelease'],

      ['1.2.4-alpha.0', '1.2.4-alpha.1', 'prerelease'],
      ['1.2.4-alpha.0', '1.2.4', 'patch'],
      ['1.2.4-alpha.0', '1.2.5', 'patch'],
      ['1.2.4-alpha.0', '1.3.0', 'minor'],
      ['1.2.4-alpha.0', '2.0.0', 'major'],

      ['1.3.0-alpha.0', '1.3.0', 'minor'],
    ];

    list.forEach(([currentVersion, nextVersion, expected]) => {
      const actual = getReleaseType(currentVersion, nextVersion);
      expect({ currentVersion, nextVersion, result: actual }).toEqual({
        currentVersion,
        nextVersion,
        result: expected,
      });
    });
  });
});
