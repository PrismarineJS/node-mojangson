var parser = require("./grammar").parser;

module.exports={parse:function(text){return parser.parse(text)}};
