/* eslint-env mocha */

const assert = require('assert')
const mojangson = require('../')

describe('mojangson', function () {
  const data = [
    ['{}', {}],
    ['{key:value}', { key: { value: 'value', type: 'string' } }],
    ['{key:"value"}', { key: { value: 'value', type: 'string' } }],
    ['{key:"va,lue"}', { key: { value: 'va,lue', type: 'string' } }],
    ['{k1:v1,k2:v2}', { k1: { value: 'v1', type: 'string' }, k2: { value: 'v2', type: 'string' } }],
    ['{number:0s}', { number: { value: 0, type: 'short' } }],
    ['{number:35.765d}', { number: { value: 35.765, type: 'double' } }],
    ['{number:35i}', { number: { value: 35, type: 'int' } }],
    ['{number:123b}', { number: { value: 123, type: 'byte' } }],
    ['{nest:{}}', { nest: {} }],
    ['{nest:{nest:{}}}', { nest: { nest: {} } }],
    ['{id:35,Damage:5,Count:2,tag:{display:{Name:Testing}}}', { id: { value: 35, type: 'int' }, Damage: { value: 5, type: 'int' }, Count: { value: 2, type: 'int' }, tag: { display: { Name: { value: 'Testing', type: 'string' } } } }],
    ['{id:"minecraft:dirt",Damage:0s,Count:1b}', { id: { value: 'minecraft:dirt', type: 'string' }, Damage: { value: 0, type: 'short' }, Count: { value: 1, type: 'byte' } }],
    ['{key:value,}', { key: { value: 'value', type: 'string' } }],
    ['[0:v1,1:v2]', [{ value: 'v1', type: 'string' }, { value: 'v2', type: 'string' }]],
    ['[0:"§6Last Killed: None",1:"§6Last Killer: None",2:"§6Rank: §aNovice-III",3:"§6§6Elo Rating: 1000",]', [{ value: '§6Last Killed: None', type: 'string' }, { value: '§6Last Killer: None', type: 'string' }, { value: '§6Rank: §aNovice-III', type: 'string' }, { value: '§6§6Elo Rating: 1000', type: 'string' }]],
    ['{id:1s,Damage:0s,Count:1b,tag:{display:{Name:"§r§6Class: Civilian",Lore:[0:"§6Last Killed: None",1:"§6Last Killer: None",2:"§6Rank: §aNovice-III",3:"§6§6Elo Rating: 1000",],},},}', { id: { value: 1, type: 'short' }, Damage: { value: 0, type: 'short' }, Count: { value: 1, type: 'byte' }, tag: { display: { Name: { value: '§r§6Class: Civilian', type: 'string' }, Lore: [{ value: '§6Last Killed: None', type: 'string' }, { value: '§6Last Killer: None', type: 'string' }, { value: '§6Rank: §aNovice-III', type: 'string' }, { value: '§6§6Elo Rating: 1000', type: 'string' }] } } }],
    ['[1,2,3]', [{ value: 1, type: 'int' }, { value: 2, type: 'int' }, { value: 3, type: 'int' }]],
    ['[1,2,3,]', [{ value: 1, type: 'int' }, { value: 2, type: 'int' }, { value: 3, type: 'int' }]],
    ['[]', []],
    ['{id:"minecraft:yellow_shulker_box",Count:1b,tag:{BlockEntityTag:{CustomName:"Stacked Totems",x:0,y:0,z:0,id:"minecraft:shulker_box",Lock:""},display:{Name:"Stacked Totems"}},Damage:0s}', { id: { value: 'minecraft:yellow_shulker_box', type: 'string' }, Count: { value: 1, type: 'byte' }, tag: { BlockEntityTag: { CustomName: { value: 'Stacked Totems', type: 'string' }, x: { value: 0, type: 'int' }, y: { value: 0, type: 'int' }, z: { value: 0, type: 'int' }, id: { value: 'minecraft:shulker_box', type: 'string' }, Lock: { value: '', type: 'string' } }, display: { Name: { value: 'Stacked Totems', type: 'string' } } }, Damage: { value: 0, type: 'short' } }]
  ]
  data.forEach(function (a) {
    it('should be equal', function () {
      // console.log(JSON.stringify([a[0], mojangson.parse(a[0])]) + ',')
      assert.deepStrictEqual(mojangson.parse(a[0]), a[1])
    })
  })
})
