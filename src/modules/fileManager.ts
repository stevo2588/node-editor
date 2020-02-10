import { readFileSync } from 'fs';
import path from 'path';


const staticDir = '../../static';

export const getTemplateFile = (filename: string) => {
  return readFileSync(path.resolve(staticDir, `./${filename}.handlebars`), { encoding: 'utf8' });
};

export const getTransformerFile = (filename: string) => {
  return readFileSync(path.resolve(staticDir, `./${filename}.jq`), { encoding: 'utf8' });
};

export const getSpecFile = (filename: string) => {
  return readFileSync(filename, { encoding: 'utf8' });
};
