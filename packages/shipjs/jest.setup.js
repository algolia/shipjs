import {
  info,
  warning,
  error,
  slateblue,
  bold,
  underline,
  reset,
} from './src/color';
import { mockColor } from './tests/util';
jest.mock('shipjs-lib');
jest.mock('./src/color');
jest.mock('./src/util');
jest.mock('./src/helper');

beforeEach(() => {
  [info, warning, error, slateblue, bold, underline, reset].forEach(mockColor);
});

afterEach(() => {
  jest.clearAllMocks();
});
