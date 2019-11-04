export default function extractSpecificChangelog(changelog, version) {
  if (!changelog) {
    return null;
  }
  // const changelogMatcher = new RegExp(
  //   `#+?[\\s\\[]*?(${version})(.|\n)+?(?=#+?[\\s\\[]*?\\d\\.\\d|$)`
  // );
  const escapedVersion = version.replace(/\./g, '\\.');
  const changelogMatcher = new RegExp(
    `(#+\\s\\[?v?${escapedVersion}[\\s\\S]*?)#+\\s\\[?v?\\d\\.\\d\\.\\d`,
    'g'
  );
  const changelogMatch = changelog.match(changelogMatcher);
  return changelogMatch !== null ? changelogMatch[0] : null;
}
