export default function getPublishCommand({
  isYarn,
  publishCommand,
  tag,
  dir,
  generateProvenance,
}) {
  const provenance = generateProvenance ? ' --provenance' : '';
  const npmPublish = `npm publish --tag ${tag}${provenance}`;
  const setRegistry = 'npm_config_registry=https://registry.npmjs.org/';
  const defaultCommand = isYarn ? `${setRegistry} ${npmPublish}` : npmPublish;

  return publishCommand({ isYarn, tag, defaultCommand, dir });
}
