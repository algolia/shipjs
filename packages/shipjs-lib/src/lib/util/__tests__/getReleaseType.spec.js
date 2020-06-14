import getReleaseType from '../getReleaseType';

describe('getReleaseType', () => {
  it('works', () => {
    const list = [
      ['2.0.0', 'major'],
      ['1.3.0', 'minor'],
      ['1.2.4', 'patch'],
      ['1.2.5', 'patch'],
      ['1.2.4-alpha.0', 'prerelease'],
    ];

    list.forEach(([nextVersion, expected]) => {
      const actual = getReleaseType(nextVersion);
      expect({ nextVersion, result: actual }).toEqual({
        nextVersion,
        result: expected,
      });
    });
  });
});
