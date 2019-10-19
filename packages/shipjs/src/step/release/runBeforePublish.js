import runStep from '../runStep';
import { wrapExecWithDir, print } from '../../util';
import { info } from '../../color';

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
