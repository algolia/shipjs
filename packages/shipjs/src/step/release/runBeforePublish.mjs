import runStep from '../runStep.mjs';
import { wrapExecWithDir, print } from '../../util/index.mjs';
import { info } from '../../color.mjs';

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
