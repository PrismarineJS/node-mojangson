/* eslint-env mocha */
const assert = require('assert')
const mojangson = require('../')

describe('Always use quotes for names and strings', () => {
  // Seems that from a certain MC version SNBTs stopped working without quotes (as for 1.18.2)
  [
    '{"var":"value1","var1":123b,"var2":"value3","var3":"value4"}',
    '[B;1b,2b,3b]',
    '{"id":"minecraft:yellow_shulker_box","Count":1b,"tag":{"BlockEntityTag":{"CustomName":"Stacked Totems","x":0,"y":0,"z":0,"id":"minecraft:shulker_box","Lock":""},"display":{"Name":"Stacked Totems"}},"Damage":0s}',
    '{"SomeField":"кириллиц А"}',
    '{"AField":"\\""}'
  ].forEach(s => {
    it('sould remain unchanged', () => {
      assert.strictEqual(mojangson.stringify(mojangson.parse(s), true), s)
    })
  });
  // Formatting tests
  [
    ['{var: value1, var1:123b, "var2":value3, "var3": "value4"}', '{"var":"value1","var1":123b,"var2":"value3","var3":"value4"}'],
    ['{SomeField: кириллицА}', '{"SomeField":"кириллицА"}'],
    ['{AField: "\\""}', '{"AField":"\\""}']
  ].forEach(([input, expected]) => {
    it('sould be equal', () => {
      assert.strictEqual(mojangson.stringify(mojangson.parse(input), true), expected)
    })
  })
})
