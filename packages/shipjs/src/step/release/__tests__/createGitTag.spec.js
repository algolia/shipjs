import { run } from '../../../util';
import createGitTag from '../createGitTag';

describe('createGitTag', () => {
  it('works', () => {
    const { tagName } = createGitTag({
      version: '1.2.3',
      config: { getTagName: () => 'v1.2.3' },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({
      command: 'git tag v1.2.3',
      dir: '.',
      dryRun: false,
    });
    expect(tagName).toEqual('v1.2.3');
  });
});
