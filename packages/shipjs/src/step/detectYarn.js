import runStep from './runStep';
import { detectYarn } from '../util';

export default ({ dir }) =>
  runStep({ title: 'Checking if using yarn.' }, () => {
    return detectYarn(dir);
  });
