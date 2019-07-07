import inquirer from 'inquirer';
const questions = [
  {
    type: 'input',
    name: 'first_name',
    message: "What's your first name",
  },
];

inquirer.prompt(questions).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
});
