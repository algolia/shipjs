import { notifyPrepared } from '../../util/slack';
import runStep from '../runStep';

export default async ({ config, appName, version, pullRequestUrl }) =>
  await runStep({ title: 'Notifying notifyPrepared to Slack' }, async () => {
    await notifyPrepared({
      config,
      appName,
      version,
      pullRequestUrl,
    });
  });
