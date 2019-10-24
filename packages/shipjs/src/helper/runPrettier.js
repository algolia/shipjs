import prettier from 'prettier';
import fs from 'fs';
import path from 'path';

export default async function runPrettier({ filePath, dir }) {
  const text = fs.readFileSync(filePath).toString();
  const options = await prettier.resolveConfig(dir);
  const formatted = prettier.format(text, {
    parser: getParser(filePath),
    ...(options || {}),
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
