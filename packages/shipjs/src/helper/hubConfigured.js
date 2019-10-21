import { silentExec } from 'shipjs-lib';

export default function hubConfigured() {
  return (
    silentExec(
      `yes "" | GITHUB_TOKEN=${process.env.GITHUB_TOKEN || ''} hub api user`,
      {
        ignoreError: true,
      }
    ).code === 0
  );
}
