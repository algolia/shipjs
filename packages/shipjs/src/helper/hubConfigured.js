import { silentExec } from 'shipjs-lib';

export default function hubConfigured() {
  return (
    silentExec(
      `yes "" | GITHUB_TOKEN=${process.env.GITHUB_TOKEN || ''} hub release`,
      {
        ignoreError: true,
      }
    ).code === 0
  );
}
