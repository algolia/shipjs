import { run } from '../../../util';
import createGitTag from '../createGitTag';

describe('createGitTag', () => {
  it('works with one tag', () => {
    const { tagNames } = createGitTag({
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
    expect(tagNames).toEqual(['v1.2.3']);
  });

  it('works with multiple tags', () => {
    const { tagNames } = createGitTag({
      version: '1.2.3',
      config: { getTagName: () => ['instantsearch.js@1.2.3', 'swag@4'] },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({
      command: 'git tag instantsearch.js@1.2.3 && git tag swag@4',
      dir: '.',
      dryRun: false,
    });
    expect(tagNames).toEqual(['instantsearch.js@1.2.3', 'swag@4']);
  });
});
