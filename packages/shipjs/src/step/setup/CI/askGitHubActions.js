import inquirer from 'inquirer';
import formatMessage from '../formatMessage';

export default async function askGitHubActions() {
  const registriesMap = {
    'npm registry': 'https://registry.npmjs.org',
    'github registry': 'https://npm.pkg.github.com',
  };

  const registriesNames = Object.keys(registriesMap);
  const {
    selectedRegistryName,
    manualPrepare,
    schedulePrepare,
  } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedRegistryName',
      message: 'Where do you publish package?',
      choices: registriesNames,
      default: registriesNames[0],
    },
    {
      type: 'confirm',
      name: 'manualPrepare',
      message: formatMessage(
        'Add manual prepare with issue comment?',
        'You can create `@shipjs prepare` comment on any issue and then github actions run `shipjs prepare`'
      ),
      default: true,
    },
    {
      type: 'confirm',
      name: 'schedulePrepare',
      message: 'Schedule your release?',
      default: true,
    },
  ]);

  const offset = new Date().getTimezoneOffset() / 60;
  const hour = 11 + offset;
  const tuesday = 2;
  const defaultCronExpr = `0 ${hour} * * ${tuesday}`;
  const { cronExpr } = await inquirer.prompt(
    [
      schedulePrepare
        ? {
            type: 'input',
            name: 'cronExpr',
            message: formatMessage(
              'When to release?',
              'To learn about cron expressions, visit https://crontab.guru/\nThe default value ("Every Tuesday 11am")'
            ),
            default: defaultCronExpr,
          }
        : undefined,
    ].filter(Boolean)
  );

  const registry = registriesMap[selectedRegistryName];

  return {
    registry,
    registryName: selectedRegistryName,
    manualPrepare,
    schedulePrepare,
    cronExpr,
  };
}
