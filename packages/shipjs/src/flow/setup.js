import printHelp from '../step/setup/printHelp';
import askQuestions from '../step/setup/askQuestions';

async function setup({ help = false, dir = '.' }) {
  if (help) {
    printHelp();
    return;
  }
  await askQuestions({ dir });
}

const arg = {
  '--dir': String,
  '--help': Boolean,

  // Aliases
  '-d': '--dir',
  '-h': '--help',
};

export default {
  arg,
  fn: setup,
};
