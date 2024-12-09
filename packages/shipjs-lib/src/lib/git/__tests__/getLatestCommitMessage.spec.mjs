import getLatestCommitMessage from '../getLatestCommitMessage.mjs';
import silentExec from '../../shell/silentExec.mjs';

describe('getLatestCommitMessage', () => {
  it('gets latest commit message', () => {
    silentExec('./tests/bootstrap-examples/latest-commit-message.sh');
    const actual = getLatestCommitMessage('sandbox/latest-commit-message');
    expect(actual).toBe('this is a latest commit message');
  });
});
