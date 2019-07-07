import hasTag from '../hasTag';
import silentExec from '../../shell/silentExec';

describe('hasTag', () => {
  it('checks if it does not have tag', () => {
    silentExec('./tests/bootstrap-examples/empty.sh no-tag');
    expect(hasTag('v1.0.0', 'sandbox/no-tag')).toBe(false);
  });
  it('checks if it has tag', () => {
    silentExec('./tests/bootstrap-examples/with-tag.sh');
    expect(hasTag('v0.0.1', 'sandbox/with-tag')).toBe(true);
  });
});
