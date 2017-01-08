/**
 * Created by user on 2017/1/7.
 */
var fs = require('fs');
var Cheat = require('./lib/cht');

var file = './test.cht';

var csvtext = '7E1D2C,07,Gau Rage Pack 1/32 ';
csvtext = 'GauRagePack1/32最大4人同時に操作可能なパーティプレイを楽しむことができる本格的ARPG！ Gau Rage Pack 1/32 ';
csvtext = '检查，很B多B时B候我们需要判断数据的类型，对应后续的操作' + csvtext;

//csvtext = 'GauRagePack1/32最大4';

console.log(Cheat.code_data({
	code: '7E1D2C07',
	desc: csvtext,
	//maxbyte: false
}));

console.log(Cheat.code_data({
	code: '7E1D2C',
	value: 7,
	desc: csvtext,
	//maxbyte: false
}, false));

//csvtext = 'Gau';

var data = Cheat.desc_encode(csvtext);

console.log([data, Cheat.desc_encode(csvtext, 18),  Cheat.buffer_from(csvtext)]);

console.log(Buffer.from(csvtext, 'utf8').toString().length, Buffer.from(csvtext, 'utf8').toString('ascii').length)

//csvtext = substr_utf8_bytes(csvtext, 0, 18);
//
//console.log(csvtext, csvtext.substr(0, 18), csvtext.length, Buffer.byteLength(csvtext, 'utf8'));

data = Buffer.alloc(18);
data.write(csvtext);

console.log(777, data, data.toString(), data.toString().length, 666, csvtext);

console.log(999, Cheat.str_cutbyte(csvtext));

console.log(Cheat.buffer_from(0), Cheat.buffer_from('0'))

return;

csvtext = str_cutbyte(csvtext)

console.log(csvtext, csvtext.substr(0, 18), csvtext.length, Buffer.byteLength(csvtext));

for (let c of csvtext)
{
	console.log(c, Buffer.byteLength(c))
}

//console.log(Buffer.byteLength('最', 'utf8'), Buffer.byteLength('大'))

function str_cutbyte(s, maxbytes)
{
	maxbytes = maxbytes || 18;
	s = s.substr(0, maxbytes);

	let bytes = Buffer.byteLength(s);

	if (bytes > maxbytes)
	{
		let d = bytes - maxbytes;

		for (let i = 1; i < d; i++)
		{
			let c = s.substr(-i);
			let b = Buffer.byteLength(c);

//			console.log(c, b);

			if (b >= d)
			{
				s = s.substr(0, s.length - i);

				break;
			}
		}
	}

	return s;
}

function encode_utf8( s ) {
	return s;
}

function substr_utf8_bytes(str, startInBytes, lengthInBytes) {

	var resultStr = '';
	var startInChars = 0;

	for (bytePos = 0; bytePos < startInBytes; startInChars++) {
		ch = str.charCodeAt(startInChars);
		bytePos += (ch < 128) ? 1 : encode_utf8(str.charAt(startInChars)).length;
	}

	end = startInChars + lengthInBytes - 1;

	for (n = startInChars; startInChars <= end; n++) {
		ch = str.charCodeAt(n);
		end -= (ch < 128) ? 1 : encode_utf8(str.charAt(n)).length;

		resultStr += str.charAt(n);
	}

	return resultStr;
}