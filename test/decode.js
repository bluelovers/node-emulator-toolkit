/**
 * Created by user on 2017/1/7.
 */

var fs = require('fs');
var Cheat = require('../lib/cht');

var file = './test.cht';
var file2 = './file/SF1802.cht';
file2 = './file/聖劍傳說3繁體原版.cht';

//var fd = fs.createReadStream(file);
//
//fd.on('data', function (buff)
//	{
//		let data = Cheat.buffer_is_valid_cht(buff, false);
//
//		console.log(data);
//		console.log([
//			data.source.slice(0, 28),
//			data.source.slice(28, 56),
//		]);
//
//	}
//);

var fd2 = fs.createReadStream(file2, {
	//encoding: 'utf16le'
});

var snes9x = require('../lib/cht/snes9x-1.54.1.js');

fd2.on('data', function (buff)
	{
		//console.log(buff);

		let data = snes9x.decode(buff);
		let data2 = snes9x.encode(data)

		//console.log(data)
		//console.log(data2)

		console.log([
			['data2', data2.equals(data.source), data2.equals(buff)],
			['data', data.source.equals(buff)],
		])

		let l = buff.length / Cheat.ROW_BYTE;

		let arr = [[], [], []];

		for (let i = 0; i < l; i++)
		{
			arr[0].push(buff.slice(Cheat.ROW_BYTE * i, Cheat.ROW_BYTE * (i+1)));
			//arr[1].push(data.source.slice(Cheat.ROW_BYTE * i, Cheat.ROW_BYTE * (i+1)));
			arr[2].push(data2.slice(Cheat.ROW_BYTE * i, Cheat.ROW_BYTE * (i+1)));

			if (!arr[0][i].equals(arr[2][i]))
			{
				console.log(i, [data.data[i], snes9x.decode_row(arr[2][i]), arr[0][i], arr[2][i]]);
			}

		}

		//console.log(arr);

		return;

		data = Cheat.buffer_is_valid_cht(buff, false);

		//console.log(data);

		$address = 0;

		for ($pos = 4; $pos > 1; $pos--) {
			$address <<= 8;
			$address |= (buff[$pos] & 0xFF);
		}



		console.log($address, Cheat.dechex($address));
		
		l = data.size / Cheat.ROW_BYTE;

		arr = [];

		for (let i = 0; i < l; i++)
		{
			//console.log(i, data.source.slice(Cheat.ROW_BYTE * i, Cheat.ROW_BYTE * (i+1)));
			arr.push(data.source.slice(Cheat.ROW_BYTE * i, Cheat.ROW_BYTE * (i+1)));
		}

		console.log(arr);
	}
);

function ord(s)
{
	return (s + '').charCodeAt(0)
}