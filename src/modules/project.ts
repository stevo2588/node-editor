import { load as loadYml } from "js-yaml";
import FileManager from "./fileManager";
import { Plugin } from './plugins';
import { generate, transform } from "./transform";


export const load = (projectPath: string, fileManager: FileManager) => {
  const projectStr = fileManager.getProjectFile(projectPath);
  const project = loadYml(projectStr);

  // TODO: load files/plugins

  return project;
}

export const validate = (projectConfig: Record<string, any>) => {
  // TODO: validate plugins
}

export const generateCode = async (specPath: string, plugin: Plugin, fileManager: FileManager) => {
  const specStr = fileManager.getSpecFile(specPath);
  // TODO: verify spec is compatible with plugin

  let transformerStr;
  if (plugin.transformer) {
    transformerStr = fileManager.getTransformerFile(`transformers/${plugin.transformer}`);
  }
  const templateStr = fileManager.getTemplateFile(`templates/${plugin.template}`);

  const data = await transform(specStr, transformerStr);
  return generate(data, templateStr);
}

export const generateAllCode = (projectConfig: Record<string, any>, fileManager: FileManager) => {

}

export const generateInfrastructureConfig = (projectConfig: Record<string, any>) => {

}
