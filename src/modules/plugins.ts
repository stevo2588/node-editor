// import { plugins } from 'spec-codegen';


export type Spec = {
  name: string;
  ext: string;
};

export type Interface = {
  spec: Spec;
  language: 'Typescript'|'MySQL';
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


const interfaces: Interface[] = [
  {
    spec: databaseSpec,
    language: 'Typescript',
    name: 'Objection.js',
  },
  {
    spec: databaseSpec,
    language: 'MySQL',
    name: 'MySQL',
  },
  {
    spec: openapiSpec,
    language: 'Typescript',
    name: 'AWS Lambda API',
  },
  {
    spec: openapiSpec,
    language: 'Typescript',
    name: 'API Client',
  },
  {
    spec: pubsubSpec,
    language: 'Typescript',
    name: 'AWS SNS',
  },
];

export default interfaces;
