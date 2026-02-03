import { info } from '../../color.js';
import { wrapExecWithDir, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ config, dir, dryRun }) =>
  runStep(
    {
      title: 'Running "beforePublish" callback.',
      skipIf: () =>
        !config.beforePublish || typeof config.beforePublish !== 'function',
    },
    async () => {
      if (dryRun) {
        print(`-> execute ${info('beforePublish()')} callback.`);
        return;
      }
      await config.beforePublish({ exec: wrapExecWithDir(dir), dir });
    }
  );
