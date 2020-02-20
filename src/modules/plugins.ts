export type Spec = {
  name: string;
  ext: string;
};

export type Plugin = {
  spec: Spec;
  language: 'Typescript'|'MySQL';
  outputExt: 'ts'|'sql';
  transformer?: string;
  template: string;
  name: string;
};

const databaseSpec: Spec = {
  name: 'database',
  ext: 'yml',
};

const openapiSpec: Spec = {
  name: 'openapi',
  ext: 'yml',
};

const pubsubSpec: Spec = {
  name: 'pubsub',
  ext: 'yml',
};

const plugins: Plugin[] = [
  {
    spec: databaseSpec,
    language: 'Typescript',
    outputExt: 'ts',
    transformer: 'database',
    template: 'objection',
    name: 'Objection.js',
  },
  {
    spec: databaseSpec,
    language: 'MySQL',
    outputExt: 'sql',
    transformer: 'database',
    template: 'mysql',
    name: 'MySQL',
  },
  {
    spec: openapiSpec,
    language: 'Typescript',
    outputExt: 'ts',
    transformer: 'openapi',
    template: 'typescript-api-aws-lambda-multi',
    name: 'AWS Lambda API',
  },
  {
    spec: openapiSpec,
    language: 'Typescript',
    outputExt: 'ts',
    transformer: 'openapi',
    template: 'typescript-api-client',
    name: 'API Client',
  },
  {
    spec: pubsubSpec,
    language: 'Typescript',
    outputExt: 'ts',
    transformer: 'pubsub',
    template: 'typescript-sns',
    name: 'AWS SNS',
  },
];

export default plugins;
