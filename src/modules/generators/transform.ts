import yaml from 'js-yaml';
import Handlebars from 'handlebars';
import { flatten } from 'ramda';


const deref = (ref: string, obj: Record<string, any>, root: Record<string, any>): { key: string, value: any } => {
  const keys = flatten(ref.split('..').map(k => k === '..' ? k : k.split('.')));
  let cur = obj;
  if (keys[0] === 'root') cur = root;

  keys.forEach((k) => {
    if (k === '$') cur = Object.keys(cur).map(k => cur[k]);
    else cur = cur[k];
  });

  return cur;
}

const transformNode = (nodeKey: string, nodeValue: any, context: { key: string, value: any }, contextRoot: Record<string, any>) => {
  console.log(nodeValue);
  const mapRef = (typeof nodeValue) === 'string' ? nodeValue : nodeValue?.source;
  if (!mapRef) throw new Error('Invalid node');

  const newContext = deref(mapRef, context, contextRoot);

  if (nodeValue.properties) {
    if (Array.isArray(newContext.value)) {
      return newContext.value.map((v: any) => Object.keys(nodeValue.properties).map(k => ({ [k]: transformNode(k, nodeValue.properties[k], v, contextRoot) })).reduce((a, b) => ({...a, ...b}), {}));
    } else {
      return Object.entries(newContext)
        .map(([key, v]: any) => Object.keys(nodeValue.properties).map(k => ({ [k]: transformNode(k, nodeValue.properties[k], v, contextRoot) })).reduce((a, b) => ({...a, ...b}), {}));
    }
  } else {
    // returns primitive
    return newContext.value;
  }
}

export const transform = (spec: string, transformSpec: string) => {
  const json = yaml.safeLoad(spec);
  const transformJson = yaml.safeLoad(transformSpec);

  return transformNode('data', transformJson.data, { key: 'CONTEXT_ROOT', value: json }, json);
}

export const generate = (data: any, templateStr: string) => {
  const template = Handlebars.compile(templateStr);

  return template(data);
}
