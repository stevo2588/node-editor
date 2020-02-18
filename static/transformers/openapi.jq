def urlToPascal: gsub("{|}"; "") | gsub("/(?<a>[a-z])"; .a | ascii_upcase);
def typeMapperTypescript:
  if . == null then null
  elif .["$ref"] then { value: (.["$ref"] | capture("(?<a>#/components/schemas)/(?<n>(.*))") | .n // "any") }
  elif .type == "object" and .properties then { value: .properties | to_entries | map({ key: .key, value: .value | typeMapperTypescript }) | from_entries, isObject: true }
  elif .type == "object" then { value: "object" }
  elif .type == "array" then { value: (.items | typeMapperTypescript), isArray: true }
  else { value: "any" } end;

. | {
  paths: .paths | to_entries | map(.key as $path | {
    endpoints: .value | to_entries | map(($path + "/" + .key) as $ept | {
      pascal: $ept | urlToPascal,
      request: .value | {
        className: (($ept | urlToPascal) + "Request"),
        description: .requestBody.content.description?,
        properties: (.requestBody.content["application/json"].schema? // null) | typeMapperTypescript,
        isRef: (if .requestBody.content["application/json"].schema["$ref"]? then true else false end),
        parameters: (.parameters? // []) | map({ key: .name, value: (.schema? // null) | typeMapperTypescript }),
      },
      responses: .value.responses? | to_entries | map({
        className: (($ept | urlToPascal) + .key),
        description: .value.description,
        properties: (.value.content["application/json"].schema? // null) | typeMapperTypescript,
        isRef: (if .value.content["application/json"].schema["$ref"]? then true else false end),
      })
    })
  }),
  schemas: .components.schemas | to_entries | map(.key as $model | {
    name: $model,
    properties: .value | typeMapperTypescript
  })
}
