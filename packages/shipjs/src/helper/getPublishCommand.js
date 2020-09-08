export default function getPublishCommand({
  isYarn,
  publishCommand,
  tag,
  dir,
}) {
  const npmPublish = `npm publish --tag ${tag}`;
  const setRegistry = 'npm_config_registry=https://registry.npmjs.org/';
  const defaultCommand = isYarn ? `${setRegistry} ${npmPublish}` : npmPublish;

  return publishCommand({ isYarn, tag, defaultCommand, dir });
}
