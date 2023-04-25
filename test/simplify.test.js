/* eslint-env mocha */
const assert = require('assert')
const mojangson = require('../')
const data = require('./simplify_test_data.js')

describe('test mojangson.simplify', () => {
  data.forEach(entry => {
    it('should be equal', () => {
      const results = mojangson.simplify(mojangson.parse(entry[0]))
      console.log(entry[0], results, entry[1])
      assert.deepStrictEqual(results, entry[1])
    })
  })
})
