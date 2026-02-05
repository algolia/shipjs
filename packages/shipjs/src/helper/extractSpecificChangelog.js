export default function extractSpecificChangelog({ changelog, version }) {
  if (!changelog) {
    return null;
  }
  const escapedVersion = version.replace(/\./g, '\\.');
  const regex = new RegExp(
    `(#+?\\s(?:<small>)?\\[?v?${escapedVersion}\\]?[\\s\\S]*?)(#+?\\s(?:<small>)?\\[?v?\\d+?\\.\\d+?\\.\\d+?\\]?)`,
    'g'
  );
  const matches = regex.exec(changelog);
  return matches ? matches[1] : null;
}
