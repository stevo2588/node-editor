import yaml from 'js-yaml';
import Handlebars from 'handlebars';
import { run } from 'node-jq';


export const transform = async (spec: string, jqTransformer?: string) => {
  const json = yaml.safeLoad(spec);

  return jqTransformer
    // @ts-ignore
    ? run(jqTransformer, json, { input: 'json', output: 'json' })
    : json;
}

export const generate = (data: any, templateStr: string) => {
  const template = Handlebars.compile(templateStr);

  return template(data);
}
