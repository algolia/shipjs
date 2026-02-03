import { info } from '../../color.js';
import { wrapExecWithDir, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ version, releaseTag, config, dir, dryRun }) =>
  runStep(
    {
      title: 'Running "afterPublish" callback.',
      skipIf: () =>
        !config.afterPublish || typeof config.afterPublish !== 'function',
    },
    async () => {
      if (dryRun) {
        print(`-> execute ${info('afterPublish()')} callback.`);
        return;
      }
      await config.afterPublish({
        exec: wrapExecWithDir(dir),
        dir,
        version,
        releaseTag,
      });
    }
  );
