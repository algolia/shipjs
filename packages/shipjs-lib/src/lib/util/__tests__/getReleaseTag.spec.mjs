import getReleaseTag from '../getReleaseTag.mjs';

describe('getReleaseTag', () => {
  it('gets latest from a normal version', () => {
    expect(getReleaseTag('1.2.3')).toBe('latest');
  });

  it('gets rc from a beta version', () => {
    expect(getReleaseTag('2.3.1-beta.1')).toBe('beta');
  });

  it('gets rc from an rc version', () => {
    expect(getReleaseTag('1.0.0-rc.9')).toBe('rc');
  });
});
