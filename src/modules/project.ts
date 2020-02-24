import { load as loadYml } from "js-yaml";
import FileManager from "./fileManager";
import { Interface } from './plugins';


export const load = (projectStr: string) => {
  const project = loadYml(projectStr);

  // TODO: load files/plugins

  return project;
}

export const validate = (projectConfig: Record<string, any>) => {
  // TODO: validate plugins
  return {};
}

export const generateCode = async (specPath: string, plugin: Interface, fileManager: FileManager) => {
  const specStr = fileManager.getSpecFile(specPath);
  // TODO: verify spec is compatible with plugin

  // let transformerStr;
  // if (plugin.transformer) {
  //   transformerStr = fileManager.getTransformerFile(`transformers/${plugin.transformer}`);
  // }
  // const templateStr = fileManager.getTemplateFile(`templates/${plugin.template}`);

  // const data = await transform(specStr, transformerStr);
  // console.log(JSON.stringify(data));
  // return generate(data, templateStr);
}

export const generateAllCode = (projectConfig: Record<string, any>, fileManager: FileManager) => {

}

export const generateInfrastructureConfig = (projectConfig: Record<string, any>) => {

}
