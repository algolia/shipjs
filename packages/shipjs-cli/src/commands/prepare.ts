import { Command } from '@oclif/command';

export default class Prepare extends Command {
  static description = 'Prepare your release';

  static examples = [`$ ship prepare`];

  async run() {
    this.log(`prepare!`);
  }
}
