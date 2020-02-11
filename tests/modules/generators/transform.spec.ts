import { readFileSync } from 'fs';
import path from 'path';
import { transform, generate } from '../../../src/modules/transform';
import transformData from '../../data/transform-data.json';


describe('UNIT-TESTS', (): void => {
  const jqTransform = readFileSync(path.resolve(__dirname, '../../../static/transformers/database-to-objection.jq'), { encoding: 'utf8' });
  const objectionTemplate = readFileSync(path.resolve(__dirname, '../../../static/templates/objection.handlebars'), { encoding: 'utf8' });
  const databaseSpec = readFileSync(path.resolve(__dirname, '../../data/test-project-1/specs/database.yml'), { encoding: 'utf8' });
  const objectionModels = readFileSync(path.resolve(__dirname, '../../data/output/database-to-objection.ts'), { encoding: 'utf8' });

  test('generates data from transformer', async (): Promise<void> => {
    const data = await transform(databaseSpec, jqTransform);

    expect(data).toEqual(transformData);
  });

  test('generates code from data', async (): Promise<void> => {
    const data = generate(transformData, objectionTemplate);

    expect(data).toEqual(objectionModels);
  });
});
