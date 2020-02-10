import { readFileSync } from 'fs';
import path from 'path';
import { transform, generate } from '../transform';


export const toTypescriptObjectionModels = async (databaseSpec: string, databaseTransformer: string) => {
  const templateStr = readFileSync(path.resolve(__dirname, './objection.handlebars'), { encoding: 'utf8' }),

  const jqTransform = readFileSync(path.resolve(__dirname, '../../../static/transformers/database-to-objection.jq'), { encoding: 'utf8' });
  const objectionTemplate = readFileSync(path.resolve(__dirname, '../../../static/templates/objection.handlebars'), { encoding: 'utf8' });
  const data = await transform(databaseSpec, databaseTransformer);
  return generate(data, templateStr);
}
