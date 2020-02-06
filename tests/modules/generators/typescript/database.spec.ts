import { readFileSync } from 'fs';
import path from 'path';
import { toObjectionModels } from '../../../../src/modules/generators/typescript/database-to-objection';



describe('UNIT-TESTS', (): void => {
  const databaseSpec = readFileSync(path.resolve(__dirname, '../../../data/test-project-1/specs/database.yml'), { encoding: 'utf8' });
  const objectionModels = readFileSync(path.resolve(__dirname, '../../../data/output/mysql-test-project-1/index.ts'), { encoding: 'utf8' });

  test('generates objection.js models', async (): Promise<void> => {
    const objModelsStr = toObjectionModels(databaseSpec);

    expect(objModelsStr).toEqual(objectionModels);
  });
});
