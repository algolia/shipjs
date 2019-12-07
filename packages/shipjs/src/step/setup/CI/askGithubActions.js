import inquirer from 'inquirer';
import formatMessage from '../formatMessage';

export default async function askGithubActions() {
  const { manualPrepare } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'manualPrepare',
      message: formatMessage(
        'Add manual prepare with issue comment?',
        'You can create `@shipjs prepare` comment on any issue and then github actions run `shipjs prepare`'
      ),
      default: true,
    },
  ]);

  return {
    manualPrepare,
  };
}
