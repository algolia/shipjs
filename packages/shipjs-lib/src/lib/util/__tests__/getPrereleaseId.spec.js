import getPrereleaseId from '../getPrereleaseId.js';

describe('getPrereleaseId', () => {
  it('works', () => {
    expect(getPrereleaseId('1.0.0-beta.2')).toBe('beta');
    expect(getPrereleaseId('1.0.0-rc.0')).toBe('rc');
    expect(getPrereleaseId('1.0.0-2')).toBeNull();
    expect(getPrereleaseId('1.0.0')).toBeNull();
  });
});
