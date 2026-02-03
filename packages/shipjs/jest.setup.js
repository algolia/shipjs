import {
  info,
  warning,
  error,
  slateblue,
  bold,
  underline,
  reset,
} from './src/color.js';
import { mockColor } from './tests/util/index.js';

jest.mock('shipjs-lib');
jest.mock('./src/color');
jest.mock('./src/helper');
jest.mock('./src/util', () => {
  const actual = jest.requireActual('./src/util');
  const mock = jest.createMockFromModule('./src/util');

  return {
    ...mock,
    arrayify: actual.arrayify,
  };
});

beforeEach(() => {
  [info, warning, error, slateblue, bold, underline, reset].forEach(mockColor);
});

afterEach(() => {
  jest.resetAllMocks();
});
