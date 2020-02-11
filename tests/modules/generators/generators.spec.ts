import { readFileSync } from 'fs';
import path from 'path';
import plugins, { Plugin } from '../../../src/modules/plugins';
import { generateCode } from '../../../src/modules/project';
import FileManager from '../../../src/modules/fileManager';


describe('UNIT-TESTS', (): void => {

  test.each(plugins)
  ('generates %o', async (plugin: Plugin): Promise<void> => {
    const specPath = path.resolve(__dirname, `../../data/test-project-1/specs/${plugin.spec.name}.${plugin.spec.ext}`);
    const fileManager = new FileManager();
    const data = await generateCode(specPath, plugin, fileManager);

    const objectionModels = readFileSync(
      path.resolve(__dirname, `../../data/output/${plugin.spec.name}-to-${plugin.template}.${plugin.outputExt}`),
      { encoding: 'utf8' },
    );
    expect(data).toEqual(objectionModels);
  });
});
