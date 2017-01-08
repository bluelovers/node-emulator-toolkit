/**
 * Created by user on 2017/1/6.
 */

var Cheat = require('../lib/cht');

console.log(Cheat);

var csvtext = '7E1D2C,07,Gau Rage Pack 1/32 ';
csvtext = '7E1D2C,07,GauRagePack1/32最大4人同時に操作可能なパーティプレイを楽しむことができる本格的ARPG！';
//csvtext = '7E1D2C,07,Gau';

csvtext = csvtext.trim();

let m = csvtext.match(/([A-Fa-f0-9]{1,6}),([A-Fa-f0-9]{1,2}),(.{1,18})/);
m = csvtext.match(/([A-Fa-f0-9]{1,6}),([A-Fa-f0-9]{1,2}),(.*)/);

console.log(m);
//
//console.log(Cheat.hexdec(m[1]), Cheat.dechex(Cheat.hexdec(m[2])), Cheat.dechex());

var data, data2;

//data = Cheat.code_encode(m[1] + m[2], Cheat.desc_encode(m[3], 18));

m[3] = '检查，很B多B时B候我们需要判断数据的类型，对应后续的操作' + m[3];

data = Cheat.code_data({
	code: m[1] + m[2],
	desc: m[3],
	//maxbyte: false
});

data2 = Cheat.code_data({
	code: m[1] + m[2],
	desc: m[3],
	maxbyte: false
});

console.log(data);

data = Cheat.code_encode(data)
data2 = Cheat.code_encode(data2)

console.log(data);
console.log(data.length);

var fs = require('fs');
var file = './test.cht';

var wstream = fs.createWriteStream(file);

wstream.write(data);
wstream.write(data);
//wstream.write(data2);
//wstream.write(data2);
wstream.end();
