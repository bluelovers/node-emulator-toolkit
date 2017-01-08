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

	if (data.error)
	{
		console.log('error: ', data.error);

		let data2 = Snes9x.encode(data);

		let file2 = './temp/' + file.replace('./file/', '');

		console.log('output: ', file2);

		var wstream = fs.createWriteStream(file2);
		wstream.write(data2);
		wstream.end();
	}
});

