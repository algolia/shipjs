import fs from 'fs';
import path from 'path';

import prettier from 'prettier';

export default async function runPrettier({ filePath, dir }) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const options = await prettier.resolveConfig(dir);
  const formatted = prettier.format(text, {
    ...(options || {}),
    parser: getParser(filePath),
  });
  fs.writeFileSync(filePath, formatted);
}

function getParser(filePath) {
  const parser = {
    '.json': 'json',
    '.js': 'babel',
  }[path.extname(filePath)];
  return parser;
}
