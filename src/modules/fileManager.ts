import { readFileSync } from 'fs';
import path from 'path';


const staticDir = path.resolve(__dirname, '../../static');

export default class FileManager {
  getProjectFile(filename: string) {
    return readFileSync(`${filename}.yml`, { encoding: 'utf8' });
  }

  getTemplateFile (filename: string) {
    return readFileSync(path.resolve(staticDir, `./${filename}.handlebars`), { encoding: 'utf8' });
  }

  getTransformerFile (filename: string) {
    return readFileSync(path.resolve(staticDir, `./${filename}.jq`), { encoding: 'utf8' });
  }

  getSpecFile (filename: string) {
    return readFileSync(filename, { encoding: 'utf8' });
  }
}
