import runStep from '../runStep';

export default ({ config }) =>
  runStep(
    {
      title: 'Running "afterPublish" callback.',
      skipIf: () =>
        !config.afterPublish || typeof config.afterPublish !== 'function',
    },
    async () => {
      await config.afterPublish();
    }
  );
