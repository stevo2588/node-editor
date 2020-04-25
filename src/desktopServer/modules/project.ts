import { promises as fs } from 'fs';
import path from 'path';
import { DiagramModel } from '../../modules/graph/diagram';
import { NodeModel } from '../../modules/graph/model';
import FileManager from "./fileManager";
import { Interface } from '../../modules/plugins';
import { generateCode } from 'spec-codegen/src/modules/generate';
import plugins from 'spec-codegen/src/modules/plugins';


type FileLocation = "home" | "desktop";

// generateCode('', plugins[0], fileManager);

// export const generateCode = async (specPath: string, plugin: Interface, fileManager: FileManager) => {
//   const specStr = fileManager.getSpecFile(specPath);
//   // TODO: verify spec is compatible with plugin

//   // let transformerStr;
//   // if (plugin.transformer) {
//   //   transformerStr = fileManager.getTransformerFile(`transformers/${plugin.transformer}`);
//   // }
//   // const templateStr = fileManager.getTemplateFile(`templates/${plugin.template}`);

//   // const data = await transform(specStr, transformerStr);
//   // console.log(JSON.stringify(data));
//   // return generate(data, templateStr);
// }

export async function saveFile(filename: string, contents: string, getPath: (loc: FileLocation) => string) {
  const projFilename = path.join(getPath('desktop'), filename);
  await fs.writeFile(projFilename, contents, 'utf8');
  return projFilename;
};

export async function loadFile(filename: string, getPath: (loc: FileLocation) => string) {
  const projFilename = path.join(getPath('desktop'), filename);
  return fs.readFile(projFilename, 'utf8');
};

async function _traverseGraph(diagram: DiagramModel) {
  const nodes = diagram.getNodeLayers().map(l => Object.values(l.getModels()).map(m => m as NodeModel)).reduce((a, b) => [...a, ...b], []);
  const nodeEffects = nodes.map(async (n) => {
    await n.codeEffect();

    if (n.graph) await _traverseGraph(n.graph);
  });
  return Promise.all(nodeEffects);
};

export async function traverseGraph(graph: any, engine: any) {
  const diagram = new DiagramModel();
  diagram.deserializeModel(graph, engine);
  return _traverseGraph(diagram);
}
