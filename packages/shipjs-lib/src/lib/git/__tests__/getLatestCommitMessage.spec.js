import getLatestCommitMessage from '../getLatestCommitMessage';
import silentExec from '../../shell/silentExec';

describe('getLatestCommitMessage', () => {
  it('test nothing now', () => {
    silentExec('./tests/bootstrap-examples/lastest-commit-message.sh');
    const actual = getLatestCommitMessage('sandbox/lastest-commit-message');
    expect(actual).toBe('this is a lastest commit message');
  });
});
