import replace from 'replace-in-file';

export default function updateVersion(
  packageJsons,
  currentVersion,
  nextVersion
) {
  replace.sync({
    files: packageJsons,
    from: `"version": "${currentVersion}"`,
    to: `"version": "${nextVersion}"`,
  });
}
