import inquirer from 'inquirer';
import formatMessage from '../formatMessage';

export default async function askCircleCI() {
  const { scheduleCircleCI } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'scheduleCircleCI',
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
      scheduleCircleCI
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
    scheduleCircleCI,
    cronExpr,
  };
}
