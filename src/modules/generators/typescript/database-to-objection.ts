import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Handlebars from 'handlebars';
import { pascalCase } from 'change-case';


const typeMap: { [type: string]: string } = {
  bigint: 'number',
  int: 'number',
};

export const toObjectionModels = (databaseSpec: string) => {
  const json = yaml.safeLoad(databaseSpec);

  const data: { tables: any[] } = {
    tables: [],
  };

  for (const schema in json) {
    const tables = json[schema].tables;
    for (const table in tables) {
      data.tables.push({
        tableName: table,
        className: pascalCase(table),
        properties: [],
      });

      for (const prop in tables[table]) {
        const type = typeof tables[table][prop] === 'string' ? tables[table][prop] : tables[table][prop].type;

        data.tables[data.tables.length - 1].properties.push({
          name: prop,
          type: typeMap[type] || type,
        });
      }

      const relations = json[schema].relations.filter((r: any) => r.from.table === table || r.to.table === table);
      if (relations.length) {
        data.tables[data.tables.length - 1].hasRelations = true;
        data.tables[data.tables.length - 1].relations = relations.map((r: any) => ({
          name: r.forwardName,
          relatedClass: pascalCase(r.to.table),
          relationType: 'HasManyRelation',
        }));
      }
    }
  }

  const template = Handlebars.compile(
    readFileSync(path.resolve(__dirname, './objection.handlebars'), { encoding: 'utf8' }),
  );
  return template(data);
}
