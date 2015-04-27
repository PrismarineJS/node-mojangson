var parser = require("./grammar").parser;


console.log(parser.parse('"test"'));
console.log(parser.parse("5"));
console.log(parser.parse('["test",5, \n{"test":false,"test3":3e5,"oo":{"lal\'a":"plop"}},null]'));
console.log(parser.parse('{"test":5}'));
