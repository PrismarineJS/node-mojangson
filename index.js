const parser = require('./grammar').parser

const nearley = require('nearley')
const grammar = require('./grammar_ne')

module.exports = {
  parse: (text) => {
    try {
      return parser.parse(text)
    } catch (e) {
      e.message = `Error parsing text '${text}'`
      throw e
    }
  },

  parse2: (text) => {
    try {
      const parserNE = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
      parserNE.feed(text)
      return parserNE.results[0]
    } catch (e) {
      e.message = `Error parsing text '${text}'`
      throw e
    }
  }
}
