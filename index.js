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
      if (!Array.isArray(value.value)) return []
      return value.value.map(function (v) { return transform(v, value.type) })
    }
    if (type === 'byteArray' || type === 'intArray' || type === 'longArray') {
      return value.value
    }
    return value
  }
  return transform(data.value, data.type)
}

function stringify ({ value, type }) {
  if (type === 'compound') {
    const str = []
    const entries = Object.entries(value)
    for (let i = 0; i < entries.length; i++) {
      const _type = entries[i][0]
      let _value = stringify(entries[i][1])
      if (_type === 'string') _value = normalizeString(_value)
      str.push(`${_type}:${_value}`)
    }
    return `{${str.join(',')}}`
  } else if (type === 'list') {
    if (!Array.isArray(value.value)) return '[]'
    const arrayElements = getArrayValues(value)
    return `[${arrayElements}]`
  } else if (type === 'byteArray' || type === 'intArray' || type === 'longArray') {
    const prefix = getArrayPrefix(type)
    const arrayElements = getArrayValues(value)
    return `[${prefix}${arrayElements}]`
  }
  let str = value + getSuffix(value, type)
  if (type === 'string') str = normalizeString(str)
  return str
}

function normalizeString (str) {
  str = str.replace(/"/g, '\\"')
  if (/'|{|}|\[|\]|:|;|,|\(|\)|§|=/g.test(str) || str === '') str = `"${str}"`
  return str
}

function getArrayValues ({ value: arr, type }) {
  const hasMissingEl = hasMissingElements(arr)
  const str = []
  // add nullable length that way [] is pased as []
  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i]
    if (curr !== undefined) {
      curr = stringify({ value: curr, type })
      if (hasMissingEl) str.push(`${i}:${curr}`)
      else str.push(curr)
    }
  }
  return str.join(',')
}

function hasMissingElements (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) return true
  }
  return false
}

const getArrayPrefix = type => type.charAt(0).toUpperCase() + ';'

function getSuffix (val, type) {
  if (type === 'double') return ((val >> 0) === val) ? 'd' : ''
  return { int: '', byte: 'b', short: 's', float: 'f', long: 'l', string: '' }[type]
}

/**
 * @description normalizes the input aka makes it the shortest equivalent string
 * @param {string} str the string of mojangson to normalize
 * @returns {string} the normalized mojangson
 */

function normalize (str) {
  return stringify(parse(str))
}

function parse (text) {
  try {
    const parserNE = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    parserNE.feed(text)
    // When there are multiple parse results (ambiguous grammar),
    // prefer results with more structured types (compound, list) over strings
    const results = parserNE.results
    if (results.length > 1) {
      // Score each result based on how "structured" it is
      const scored = results.map((r, i) => {
        const score = scoreResult(r)
        return { result: r, score }
      })
      // Sort by score descending (higher score = more structured)
      scored.sort((a, b) => b.score - a.score)
      return scored[0].result
    }
    return results[0]
  } catch (e) {
    e.message = `Error parsing text '${text}'`
    throw e
  }
}

function scoreResult (obj) {
  let score = 0
  if (!obj || typeof obj !== 'object') return score

  // Prefer compound and list types over string types
  if (obj.type === 'compound') score += 10
  if (obj.type === 'list') score += 10
  if (obj.type === 'string') score -= 1

  // Recursively score nested structures
  if (obj.value && typeof obj.value === 'object') {
    if (Array.isArray(obj.value)) {
      obj.value.forEach(item => {
        score += scoreResult(item)
      })
    } else if (obj.value.value && Array.isArray(obj.value.value)) {
      // This is a list type with value.value array
      // The items in this array are raw values, not wrapped in { type, value }
      // Score based on whether items are objects (compounds) vs primitives
      obj.value.value.forEach(item => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          // This is likely a compound object
          score += 10
          // Recursively score the object's properties
          Object.values(item).forEach(prop => {
            score += scoreResult(prop)
          })
        } else if (typeof item === 'string') {
          score -= 1
        }
      })
    } else {
      // This is a compound with nested values
      Object.values(obj.value).forEach(item => {
        score += scoreResult(item)
      })
    }
  }

  return score
}

module.exports = {
  parse,
  simplify,
  stringify,
  normalize
}
