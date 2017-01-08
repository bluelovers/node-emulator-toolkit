/**
 * Created by user on 2017/1/8.
 */

var fs = require('fs');
var Cheat = require('../lib/cht');
var Snes9x = require('../lib/cht/snes9x-1.54.1.js');

var file = './test.cht';
file = './file/聖劍傳說3繁體原版.cht';

var fd = fs.createReadStream(file);

fd.on('data', function (buff)
{
	let data = Snes9x.decode(buff);

	let arr = [];

	var Table = require('cli-table2');
	var table = new Table({
		head: ['address', 'value', 'active', 'desc'],

		compact: true,

//		chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
//			, 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
//			, 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
//			, 'right': '' , 'right-mid': '' , 'middle': ' ' },
//		style: { 'padding-left': 0, 'padding-right': 0 }
	});
	
//	console.log(table)

	for (let row of data.data)
	{
		let a = [
			row.address,
			row.value,
			row.active,
			row.desc,
		];

		arr.push(a.join(' , '));

		table.push(a);
	}



//	let data2 = Cheat.buffer_from(arr.join("\n"))
	let data2 = Cheat.buffer_from(table.toString())

	let file2 = './temp/' + file.replace('./file/', '') + '.txt';

	console.log('output: ', file2);

	var wstream = fs.createWriteStream(file2);
	wstream.write(data2);
	wstream.end();

	console.log(table.toString());
});

