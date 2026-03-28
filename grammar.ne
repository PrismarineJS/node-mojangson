@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

MAIN -> _ JVALUE _ {% (d) => d[1] %}

JVALUE -> JOBJECT {% (d) => d[0] %}
        | "'" _ JOBJECT _ "'" {% (d) => d[2] %}
        | JARRAY  {% (d) => d[0] %}
        | STRING  {% (d) => d[0] %}
        | SINGLE_QUOTED_STRING {% (d) => d[0] %}
        | "null"  {% (d) => null %}

JOBJECT -> "{" _ "}" {% (d) => { return { type: 'compound', value: {} } } %}
         | "{" _ PAIR ( _ "," _ PAIR):* (_ ","):? _ "}" {% extractObject %}

JARRAY -> "[" _ "]" {% (d) => { return { type: 'list', value: {} } } %}
        | "[" _ [BIL] _ ";" _ JVALUE ( _ "," _ JVALUE):* (_ ","):? _ "]" {% extractTypedArray %}
        | "[" _ JVALUE ( _ "," _ JVALUE):* (_ ","):? _ "]" {% extractArray %}
        | "[" _ PAIR ( _ "," _ PAIR):* (_ ","):? _ "]" {% extractArrayPair %}

PAIR -> STRING _ ":" _ JVALUE {% (d) => [d[0].value, d[4]] %}

STRING -> "\"" ( [^\\"] | "\\" ["bfnrt\/\\] | "\\u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] ):* "\"" {% (d) => parseValue( JSON.parse(d.flat(3).map(b => b.replace('\n', '\\n')).join('')) ) %}
        | [^\"\'}\]:;,\s]:+ {% (d) => parseValue(d[0].join('')) %}

SINGLE_QUOTED_STRING -> "'" ( [^\\'] | "\\" ["bfnrt\/\\'] | "\\u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] ):* "'" {% (d) => parseSingleQuoteString(d) %}

@{%

// Because of unquoted strings, parsing can be ambiguous.
// It is more efficient to have the parser extract string
// and post-process it to retrieve numbers
function parseValue (str) {
  if (str === 'true') return { type: 'boolean', value: true }
  if (str === 'false') return { type: 'boolean', value: false }
  const suffixes = "bslfdi"
  const suffixToType = { 'b': 'byte', 's': 'short', 'l': 'long', 'f': 'float', 'd': 'double', 'i': 'int' }
  const lastC = str.charAt(str.length - 1).toLowerCase()
  if (suffixes.indexOf(lastC) !== -1) {
    const v = parseFloat(str.substring(0, str.length - 1))
    if (!isNaN(v)) return { value: v, type: suffixToType[lastC]}
    return { value: str, type: 'string' }
  }
  // When no letter is used and Minecraft can't tell the type from context,
  // it assumes double if there's a decimal point, int if there's no decimal
  // point and the size fits within 32 bits, or string if neither is true.
  // https://minecraft.gamepedia.com/Commands#Data_tags
  const v = parseFloat(str)
  const decimal = str.includes('.')
  const isInt32 = (v >> 0) === v
  if (!isNaN(str) && (decimal || isInt32)) return { value: v, type: decimal ? 'double' : 'int'}
  return { value: str, type: 'string' }
}

function parseSingleQuoteString(d) {
  // Build the string content from the parsed parts similar to double-quoted strings
  // The structure is: ["'", [content parts], "'"]
  // d[1] contains the content between quotes
  const content = d[1] || []
  let str = "'"
  for (const part of content) {
    if (Array.isArray(part)) {
      str += part.flat().join('')
    } else if (part) {
      str += part
    }
  }
  str += "'"
  
  // Process escape sequences to convert to actual string value
  // Replace escaped single quotes with actual single quotes
  // and handle other escape sequences
  str = str.replace(/\\'/g, "\\'")  // Keep escaped single quotes for JSON parsing
           .replace(/\\"/g, '\\"')   // Keep escaped double quotes
  
  // Convert to a JSON-compatible string by replacing outer single quotes with double quotes
  str = '"' + str.slice(1, -1).replace(/"/g, '\\"').replace(/\\'/g, "'") + '"'
  
  try {
    return { value: JSON.parse(str), type: 'string' }
  } catch (e) {
    // If JSON parsing fails, return the raw string content
    return { value: str.slice(1, -1), type: 'string' }
  }
}

function extractPair(kv, output) {
  if (kv[0] !== undefined) {
    output[kv[0]] = kv[1]
  }
}

function extractObject(d) {
  let output = {}
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return { type: 'compound', value: output }
}

function extractTypedArray (d) {
  let output = [d[6]]
  for (let i in d[7]) {
    output.push(d[7][i][3])
  }
  const type = {'B': 'byteArray', 'I': 'intArray', 'L': 'longArray'}[d[2]]
  return { type, value: { type: output[0].type, value: output.map(x => x.value) } }
}

function extractArray (d) {
  let output = [d[2]]
  for (let i in d[3]) {
    output.push(d[3][i][3])
  }
  return { type: 'list', value: { type: output[0].type, value: output.map(x => x.value) } }
}

function extractArrayPair (d) {
  let output = []
  extractPair(d[2], output)
  for (let i in d[3]) {
    extractPair(d[3][i][3], output)
  }
  return { type: 'list', value: { type: output[0].type, value: output.map(x => x.value) } }
}

%}
