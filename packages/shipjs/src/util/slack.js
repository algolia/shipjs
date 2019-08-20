import { IncomingWebhook } from '@slack/webhook';

async function sendSlackMessage({ config, sendArguments }) {
  const { slackIncomingHook, slack } = config;

  if (!slackIncomingHook) {
    return;
  }
  const webhook = new IncomingWebhook(slackIncomingHook);
  await webhook.send({
    ...(slack.default || {}),
    ...sendArguments,
  });
}

// https://api.slack.com/docs/messages/builder
export async function notifyPrepared({
  config,
  appName,
  version,
  pullRequestUrl,
}) {
  const { slack = {} } = config;
  const { prepared } = slack;
  if (!prepared) {
    return;
  }

  const sendArguments =
    typeof prepared === 'string'
      ? prepared
      : prepared({ appName, version, pullRequestUrl });

  await sendSlackMessage({
    config,
    sendArguments,
  });
}

export async function notifyReleaseStart({
  config,
  appName,
  version,
  latestCommitHash,
  latestCommitUrl,
}) {
  const { slack = {} } = config;
  const { releaseStart } = slack;
  if (!releaseStart) {
    return;
  }

  const sendArguments =
    typeof releaseStart === 'string'
      ? releaseStart
      : releaseStart({ appName, version, latestCommitHash, latestCommitUrl });

  await sendSlackMessage({
    config,
    sendArguments,
  });
}

export async function notifyReleaseSuccess({
  config,
  appName,
  version,
  latestCommitHash,
  latestCommitUrl,
  repoURL,
}) {
  const { slack = {} } = config;
  const { releaseSuccess } = slack;
  if (!releaseSuccess) {
    return;
  }

  const sendArguments =
    typeof releaseSuccess === 'string'
      ? releaseSuccess
      : releaseSuccess({
          appName,
          version,
          latestCommitHash,
          latestCommitUrl,
          repoURL,
        });

  await sendSlackMessage({
    config,
    sendArguments,
  });
}
