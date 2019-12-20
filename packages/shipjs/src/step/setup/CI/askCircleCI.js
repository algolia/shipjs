import inquirer from 'inquirer';
import formatMessage from '../formatMessage';

export default async function askCircleCI() {
  const { schedulePrepare } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'schedulePrepare',
      message: 'Schedule your release via CircleCI?',
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

  return {
    schedulePrepare,
    cronExpr,
  };
}
