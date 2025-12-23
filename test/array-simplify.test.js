/* eslint-env mocha */

const assert = require('assert')
const mojangson = require('../')

describe('test array simplification', () => {
  it('should simplify byteArray to plain array', () => {
    // Manually construct a byteArray object
    const byteArrayObj = {
      type: 'byteArray',
      value: {
        type: 'byte',
        value: [1, 2, 3]
      }
    }
    const simplified = mojangson.simplify(byteArrayObj)
    assert.deepStrictEqual(simplified, [1, 2, 3])
  })

  it('should simplify intArray to plain array', () => {
    // Manually construct an intArray object
    const intArrayObj = {
      type: 'intArray',
      value: {
        type: 'int',
        value: [10, 20, 30]
      }
    }
    const simplified = mojangson.simplify(intArrayObj)
    assert.deepStrictEqual(simplified, [10, 20, 30])
  })

  it('should simplify longArray to plain array', () => {
    // Manually construct a longArray object
    const longArrayObj = {
      type: 'longArray',
      value: {
        type: 'long',
        value: [100, 200, 300]
      }
    }
    const simplified = mojangson.simplify(longArrayObj)
    assert.deepStrictEqual(simplified, [100, 200, 300])
  })

  it('should simplify parsed byteArray string to plain array', () => {
    const parsed = mojangson.parse('[B;1b,2b,3b,]')
    const simplified = mojangson.simplify(parsed)
    assert.deepStrictEqual(simplified, [1, 2, 3])
  })

  it('should simplify parsed intArray string to plain array', () => {
    const parsed = mojangson.parse('[I;1,2,3]')
    const simplified = mojangson.simplify(parsed)
    assert.deepStrictEqual(simplified, [1, 2, 3])
  })

  it('should simplify parsed longArray string to plain array', () => {
    const parsed = mojangson.parse('[L;1l,2l,3l]')
    const simplified = mojangson.simplify(parsed)
    assert.deepStrictEqual(simplified, [1, 2, 3])
  })

  it('should simplify compound containing arrays correctly', () => {
    const compoundWithArrays = {
      type: 'compound',
      value: {
        bytes: {
          type: 'byteArray',
          value: {
            type: 'byte',
            value: [1, 2, 3]
          }
        },
        ints: {
          type: 'intArray',
          value: {
            type: 'int',
            value: [4, 5, 6]
          }
        },
        name: {
          type: 'string',
          value: 'test'
        }
      }
    }
    const simplified = mojangson.simplify(compoundWithArrays)
    assert.deepStrictEqual(simplified, {
      bytes: [1, 2, 3],
      ints: [4, 5, 6],
      name: 'test'
    })
  })
})
