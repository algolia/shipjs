import runStep from '../runStep';
import wrapExecWithDir from '../../util/wrapExecWithDir';

export default ({ config, dir, dryRun }) =>
  runStep(
    {
      title: 'Running "beforePublish" callback.',
      skipIf: () =>
        !config.beforePublish || typeof config.beforePublish !== 'function',
    },
    async ({ print, info }) => {
      if (dryRun) {
        print(`-> execute ${info('beforePublish()')} callback.`);
        return;
      }
      await config.beforePublish({ exec: wrapExecWithDir(dir), dir });
    }
  );
