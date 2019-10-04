import runStep from '../runStep';

export default ({ config }) =>
  runStep(
    {
      title: 'Running "beforePublish" callback.',
      skipIf: () =>
        !config.beforePublish || typeof config.beforePublish !== 'function',
    },
    async () => {
      await config.beforePublish();
    }
  );
