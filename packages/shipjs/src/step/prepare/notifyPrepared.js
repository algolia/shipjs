import { notifyPrepared } from '../../util';
import runStep from '../runStep';

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
