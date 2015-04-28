# node-mojangson
[![NPM version](https://badge.fury.io/js/node-mojangson.svg)](http://badge.fury.io/js/node-mojangson) [![Build Status](https://circleci.com/gh/rom1504/node-mojangson.svg?style=shield)](https://circleci.com/gh/rom1504/node-mojangson)

node-mojangson is a mojangson parser.

## Mojangson specification
Mojangson is mojang's variant of json. It is basically json with the following changes :

 * array can be indexed (example : `[0:"v1",1:"v2",2:"v3"]`)
 * array and object can have trailing comma (example : `[5,4,3,]` and `{"a":5,"b":6,}`)
 * there can be string without quote (example : `{mykey:myvalue}`)
 * numbers can be suffixed by b, s, l, f or the same in upper case (example : `{number:5b}`)
 * mojangson stays a superset of json : every json is a mojangson

## Parser
This parser is build using jison.

See the [grammar](grammar.jison) and the examples in the [test](test/test.js) for more information.

## Usage
Usage example :

```js
var mojangson=require("mojangson");
console.log(mojangson.parse("{mykey:myvalue}"));
```

The provided method mojangson.parse return a javascript object corresponding to the mojangson passed in input.


