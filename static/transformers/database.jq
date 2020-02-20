def typeMapper: if . == "bigint" or . == "int" then "number" else . end;
def snakeToPascal: ("_" + .) | gsub( "_(?<a>[a-z])"; .a | ascii_upcase);

. | {
  tables: [
    . as $root | [ .[].tables] | add | to_entries[] | .key as $tableName | {
      tableName: .key,
      className: .key | snakeToPascal,
      properties: .value | to_entries | map({
        name: .key,
        type: (.value.type? // .value),
        typescriptType: (.value.type? // .value) | typeMapper,
      }),
      relations: $root[].relations | [
        map(select(.from.table == $tableName) | {
          name: .forwardName,
          relatedClass: .to.table | snakeToPascal,
          fromField: .from.field,
          toField: .to.field,
          throughClass: (if has("through") then .through.table | snakeToPascal else null end),
          throughFromField: .through?.fromField?,
          throughToField: .through?.toField?,
          relationType: (if .through and .single then "HasOneThroughRelation"
            elif .through then "ManyToManyRelation"
            elif .single then "HasOneRelation"
            else "HasManyRelation" end),
          isArray: .single | not
        }),
        map(select(.to.table == $tableName) | {
          name: .reverseName,
          # foreignKey: .to.field,
          relatedClass: .from.table | snakeToPascal,
          fromField: .to.field,
          toField: .from.field,
          throughClass: (if has("through") then .through.table | snakeToPascal else null end),
          throughFromField: .through?.toField?,
          throughToField: .through?.fromField?,
          relationType: (if .through and .single then "HasOneThroughRelation"
            elif .through then "ManyToManyRelation"
            else "BelongsToOneRelation" end),
          isArray: (.through? and (.single | not))
        })
      ] | add
    }
  ]
}
