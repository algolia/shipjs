import getReleaseType from '../getReleaseType';

describe('getReleaseType', () => {
  it('gets release type from current version and next version', () => {
    expect(getReleaseType('1.0.0', '0.10.99')).toBe('major');
  });
});
