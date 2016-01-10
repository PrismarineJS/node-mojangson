'use strict';

var Parser = require('jison').Parser;
var fs = require('fs');
var path = require('path');

var options = {
};

var grammar = fs.readFileSync(path.join(__dirname, 'grammar.jison'), 'utf8');
var parser = new Parser(grammar);
var parserSource = parser.generate(options);
fs.writeFileSync(path.join(__dirname, 'grammar.js'), parserSource, 'utf8');
