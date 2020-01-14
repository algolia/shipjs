import { IncomingWebhook } from '@slack/webhook';

async function sendSlackMessage({ config, sendArguments }) {
  const { slackIncomingHook, slack } = config;

  if (!slackIncomingHook || !sendArguments) {
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
    typeof prepared === 'function'
      ? prepared({ appName, version, pullRequestUrl })
      : prepared;

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
    typeof releaseStart === 'function'
      ? releaseStart({ appName, version, latestCommitHash, latestCommitUrl })
      : releaseStart;

  await sendSlackMessage({
    config,
    sendArguments,
  });
}

export async function notifyReleaseSuccess({
  config,
  appName,
  version,
  tagName,
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
    typeof releaseSuccess === 'function'
      ? releaseSuccess({
          appName,
          version,
          tagName,
          latestCommitHash,
          latestCommitUrl,
          repoURL,
        })
      : releaseSuccess;

  await sendSlackMessage({
    config,
    sendArguments,
  });
}
