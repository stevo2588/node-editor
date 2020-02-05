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
      
      const newTable = data.tables[data.tables.length - 1];

      for (const prop in tables[table]) {
        const type = typeof tables[table][prop] === 'string' ? tables[table][prop] : tables[table][prop].type;

        newTable.properties.push({
          name: prop,
          type: typeMap[type] || type,
        });
      }

      const forwardRelations = json[schema].relations.filter((r: any) => r.from.table === table);
      const reverseRelations = json[schema].relations.filter((r: any) => r.to.table === table);
      newTable.relations = [];

      if (forwardRelations.length) {
        newTable.hasRelations = true;
        newTable.relations = [...newTable.relations, ...forwardRelations.map((r: any) => ({
          name: r.forwardName,
          relatedClass: pascalCase(r.to.table),
          fromField: r.from.field,
          toField: r.to.field,
          through: r.through ? true : false,
          throughClass: r.through ? pascalCase(r.through.table) : undefined,
          throughFromField: r.through ? r.through.fromField : undefined,
          throughToField: r.through ? r.through.toField : undefined,
          relationType:
            r.through && r.single ? 'HasOneThroughRelation'
            : r.through ? 'ManyToManyRelation'
            : r.single ? 'HasOneRelation'
            : 'HasManyRelation',
          isArray: !r.single,
        }))];
      }
      if (reverseRelations.length) {
        newTable.hasRelations = true;
        newTable.relations = [...newTable.relations, ...reverseRelations.map((r: any) => ({
          name: r.reverseName,
          relatedClass: pascalCase(r.from.table),
          fromField: r.to.field,
          toField: r.from.field,
          through: r.through ? true : false,
          throughClass: r.through ? pascalCase(r.through.table) : undefined,
          throughFromField: r.through ? r.through.toField : undefined,
          throughToField: r.through ? r.through.fromField : undefined,
          relationType:
            r.through && r.single ? 'HasOneThroughRelation'
            : r.through ? 'ManyToManyRelation'
            : 'BelongsToOneRelation',
          isArray: r.through && !r.single,
        }))];
      }

    }
  }

  const template = Handlebars.compile(
    readFileSync(path.resolve(__dirname, './objection.handlebars'), { encoding: 'utf8' }),
  );

  return template(data);
}
