def urlToPascal: gsub("{|}"; "") | gsub("/(?<a>[a-z])"; .a | ascii_upcase);
def typescriptTypeMapper:
  if .type == "number" or .type == "integer" then "number"
  elif .type == "string" and .format == "date-time" then "Date"
  elif .type == "string" then "string"
  else "any" end;
def typeMapper:
  if . == null then null
  elif .type == "object" and .properties then (.required? // []) as $required | {
    type: .properties | to_entries | map(.key as $key | {
      key: .key,
      value: ((.value | typeMapper) + { required: any($required; index($key) >= 0) }),
    }) | from_entries,
    isObject: true,
  }
  elif .type == "array" then {
    isArray: true,
    items: (.items | typeMapper),
  }
  elif .["$ref"] then {
    type: .["$ref"],
    typescriptType: (.["$ref"] | capture("(?<a>#/components/schemas)/(?<n>(.*))") | .n // "any")
  }
  else {
    type: .type,
    typescriptType: . | typescriptTypeMapper,
  } end;

. | {
  paths: .paths | to_entries | map(.key as $path | {
    path: $path,
    endpoints: .value | to_entries | map(($path + "/" + .key) as $ept | {
      method: .key | ascii_upcase,
      pascal: $ept | urlToPascal,
      request: .value | {
        className: (($ept | urlToPascal) + "Request"),
        description: .requestBody.content.description?,
        properties: (.requestBody.content["application/json"].schema? // null) | typeMapper,
        isRef: (if .requestBody.content["application/json"].schema["$ref"]? then true else false end),
        parameters: (.parameters? // []) | map({ name: .name, type: ((.schema? // null) | typeMapper) }),
      },
      responses: .value.responses? | to_entries | map({
        className: (($ept | urlToPascal) + .key),
        description: .value.description,
        properties: (.value.content["application/json"].schema? // null) | typeMapper,
        isRef: (if .value.content["application/json"].schema["$ref"]? then true else false end),
      })
    })
  }),
  schemas: .components.schemas | to_entries | map(.key as $model | {
    name: $model,
    properties: .value | typeMapper
  })
}
