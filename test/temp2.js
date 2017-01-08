/**
 * Created by user on 2017/1/8.
 */

'use strict'

var fs = require('fs');
var Cheat = require('../lib/cht');
var Snes9x = require('../lib/cht/snes9x-1.54.1.js');

let a = toInt(Cheat.buffer_from('7FF0FF', 'hex')) + toInt(Cheat.buffer_from('40', 'hex'))

console.log(Cheat.dechex(a));

function toInt(buff)
{
	return buff.readIntBE(0, buff.length);
}

var handler = {
	get: function(target, name){
		return name in target?
			target[name] :
			37;
	}
};

var p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log('c' in p, p.c); // false, 37

/*
const v8 = require('v8');
v8.setFlagsFromString('--harmony-async-await');

require('harmonica')([
	'harmony-array-values',
	'harmony-async-await'
]);
*/

var chalk = require('chalk');

// style a string
chalk.blue('Hello world!');

var colors = require('colors/safe');

console.log(colors.green('hello')); // outputs green text
console.log(colors.red.underline('i like cake and pies')) // outputs red underlined text
console.log(colors.inverse('inverse the color')); // inverses the color
console.log(colors.rainbow('OMG Rainbows!')); // rainbow
console.log(colors.trap('Run the trap')); // Drops the bass

(async function testingAsyncAwait() {
	await console.log("For Trump's Sake Print me!");
})();

console.log('🐴'.length);