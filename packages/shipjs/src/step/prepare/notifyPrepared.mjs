import { notifyPrepared } from '../../util/index.mjs';
import runStep from '../runStep.mjs';

export default async ({ config, appName, version, pullRequestUrl }) =>
  await runStep(
    {
      title: 'Notifying notifyPrepared to Slack',
      skipIf: () =>
        !process.env.SLACK_INCOMING_HOOK ||
        !config.slack ||
        !config.slack.prepared,
    },
    async () => {
      await notifyPrepared({
        config,
        appName,
        version,
        pullRequestUrl,
      });
    }
  );
