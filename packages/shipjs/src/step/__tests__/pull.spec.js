import { run } from '../../util';
import pull from '../pull';

const remote = 'origin-with-token';
const currentBranch = 'main';

describe('pull', () => {
  it('works', () => {
    pull({ remote, currentBranch, dir: '.', dryRun: false });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({
      command: 'git pull origin-with-token main',
      dir: '.',
      dryRun: false,
    });
  });

  it('works with rebase flag', () => {
    pull({ remote, currentBranch, dir: '.', dryRun: false, rebase: true });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({
      command: 'git pull --rebase origin-with-token main',
      dir: '.',
      dryRun: false,
    });
  });
});
