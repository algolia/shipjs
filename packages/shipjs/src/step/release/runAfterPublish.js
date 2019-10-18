import runStep from '../runStep';
import { wrapExecWithDir } from '../../util';

export default ({ config, dir, dryRun }) =>
  runStep(
    {
      title: 'Running "afterPublish" callback.',
      skipIf: () =>
        !config.afterPublish || typeof config.afterPublish !== 'function',
    },
    async ({ print, info }) => {
      if (dryRun) {
        print(`-> execute ${info('beforePublish()')} callback.`);
        return;
      }
      await config.afterPublish({ exec: wrapExecWithDir(dir), dir });
    }
  );
