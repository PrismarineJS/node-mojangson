const nearley = require('nearley')
const grammar = require('./grammar')

function simplify (data) {
  function transform (value, type) {
    if (type === 'compound') {
      return Object.keys(value).reduce(function (acc, key) {
        acc[key] = simplify(value[key])
        return acc
      }, {})
    }
    if (type === 'list') {
      return value.value.map(function (v) { return transform(v, value.type) })
    }
    return value
  }
  return transform(data.value, data.type)
}

module.exports = {
  parse: (text) => {
    try {
      const parserNE = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
      parserNE.feed(text)
      return parserNE.results[0]
    } catch (e) {
      e.message = `Error parsing text '${text}'`
      throw e
    }
  },

  simplify
}
