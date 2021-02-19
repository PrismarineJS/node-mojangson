/* eslint-env mocha */

const assert = require('assert')
const mojangson = require('../')

describe('mojangson', function () {
  const data = [
    ['{}', {}],
    ['{key:value}', { type: 'compound', value: { key: { value: 'value', type: 'string' } } }],
    ['{key:"value"}', { type: 'compound', value: { key: { value: 'value', type: 'string' } } }],
    ['{key:"va,lue"}', { type: 'compound', value: { key: { value: 'va,lue', type: 'string' } } }],
    ['{k1:v1,k2:v2}', { type: 'compound', value: { k1: { value: 'v1', type: 'string' }, k2: { value: 'v2', type: 'string' } } }],
    ['{number:0s}', { type: 'compound', value: { number: { value: 0, type: 'short' } } }],
    ['{number:35.765d}', { type: 'compound', value: { number: { value: 35.765, type: 'double' } } }],
    ['{number:35i}', { type: 'compound', value: { number: { value: 35, type: 'int' } } }],
    ['{number:123b}', { type: 'compound', value: { number: { value: 123, type: 'byte' } } }],
    ['{nest:{}}', { type: 'compound', value: { nest: {} } }],
    ['{nest:{nest:{}}}', { type: 'compound', value: { nest: { type: 'compound', value: { nest: {} } } } }],
    ['{id:35,Damage:5,Count:2,tag:{display:{Name:Testing}}}', { type: 'compound', value: { id: { value: 35, type: 'int' }, Damage: { value: 5, type: 'int' }, Count: { value: 2, type: 'int' }, tag: { type: 'compound', value: { display: { type: 'compound', value: { Name: { value: 'Testing', type: 'string' } } } } } } }],
    ['{id:"minecraft:dirt",Damage:0s,Count:1b}', { type: 'compound', value: { id: { value: 'minecraft:dirt', type: 'string' }, Damage: { value: 0, type: 'short' }, Count: { value: 1, type: 'byte' } } }],
    ['{key:value,}', { type: 'compound', value: { key: { value: 'value', type: 'string' } } }],
    ['[0:v1,1:v2]', { type: 'list', value: { type: 'string', value: ['v1', 'v2'] } }],
    ['[0:"§6Last Killed: None",1:"§6Last Killer: None",2:"§6Rank: §aNovice-III",3:"§6§6Elo Rating: 1000",]', { type: 'list', value: { type: 'string', value: ['§6Last Killed: None', '§6Last Killer: None', '§6Rank: §aNovice-III', '§6§6Elo Rating: 1000'] } }],
    ['{id:1s,Damage:0s,Count:1b,tag:{display:{Name:"§r§6Class: Civilian",Lore:[0:"§6Last Killed: None",1:"§6Last Killer: None",2:"§6Rank: §aNovice-III",3:"§6§6Elo Rating: 1000",],},},}', { type: 'compound', value: { id: { value: 1, type: 'short' }, Damage: { value: 0, type: 'short' }, Count: { value: 1, type: 'byte' }, tag: { type: 'compound', value: { display: { type: 'compound', value: { Name: { value: '§r§6Class: Civilian', type: 'string' }, Lore: { type: 'list', value: { type: 'string', value: ['§6Last Killed: None', '§6Last Killer: None', '§6Rank: §aNovice-III', '§6§6Elo Rating: 1000'] } } } } } } } }],
    ['[1,2,3]', { type: 'list', value: { type: 'int', value: [1, 2, 3] } }],
    ['[1,2,3,]', { type: 'list', value: { type: 'int', value: [1, 2, 3] } }],
    ['[]', []],
    ['{id:"minecraft:yellow_shulker_box",Count:1b,tag:{BlockEntityTag:{CustomName:"Stacked Totems",x:0,y:0,z:0,id:"minecraft:shulker_box",Lock:""},display:{Name:"Stacked Totems"}},Damage:0s}', { type: 'compound', value: { id: { value: 'minecraft:yellow_shulker_box', type: 'string' }, Count: { value: 1, type: 'byte' }, tag: { type: 'compound', value: { BlockEntityTag: { type: 'compound', value: { CustomName: { value: 'Stacked Totems', type: 'string' }, x: { value: 0, type: 'int' }, y: { value: 0, type: 'int' }, z: { value: 0, type: 'int' }, id: { value: 'minecraft:shulker_box', type: 'string' }, Lock: { value: '', type: 'string' } } }, display: { type: 'compound', value: { Name: { value: 'Stacked Totems', type: 'string' } } } } }, Damage: { value: 0, type: 'short' } } }]
  ]
  data.forEach(function (a) {
    it('should be equal', function () {
      // console.log(JSON.stringify([a[0], mojangson.parse(a[0])]) + ',')
      assert.deepStrictEqual(mojangson.parse(a[0]), a[1])
    })
  })
})
