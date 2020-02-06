import { readFileSync } from 'fs';
import path from 'path';
import { transform, generate } from '../../../src/modules/generators/transform';
import transformData from './transform-data.json';


describe('UNIT-TESTS', (): void => {
  const databaseSpec = readFileSync(path.resolve(__dirname, '../../data/test-project-1/specs/database.yml'), { encoding: 'utf8' });
  const transformSpec = readFileSync(path.resolve(__dirname, '../../../src/modules/generators/typescript/database-transformer.yml'), { encoding: 'utf8' });
  const objectionTemplate = readFileSync(path.resolve(__dirname, '../../../src/modules/generators/typescript/objection.handlebars'), { encoding: 'utf8' });
  const objectionModels = readFileSync(path.resolve(__dirname, '../../data/output/mysql-test-project-1/index.ts'), { encoding: 'utf8' });

  test('generates data from database transformer', async (): Promise<void> => {
    const data = transform(databaseSpec, transformSpec);
    console.log(data);

    expect(data).toEqual(transformData);
  });

  test('generates objection.js models from data', async (): Promise<void> => {
    const data = generate(transformData, objectionTemplate);

    expect(data).toEqual(objectionModels);
  });
});
