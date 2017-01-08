/**
 * Created by user on 2017/1/8.
 */

"use strict";

const Cheat = require('../cht');

const ROW_BYTE = 28;
const CHT_ENABLE = 0x08;
const CHT_DISABLE = 0x0c;
const ROW_PAD = 2;
const DESC_MAXBYTE = 18;

module.exports = {

	ROW_BYTE: ROW_BYTE,
	CHT_ENABLE: CHT_ENABLE,
	CHT_DISABLE: CHT_DISABLE,
	ROW_PAD: ROW_PAD,
	DESC_MAXBYTE: DESC_MAXBYTE,

	encode: encode,
	decode: decode,
	decode_row: decode_row
};

function encode(source, options)
{
	let list = Array.isArray(source) ? source : source.data;

	//console.log(list);

	let row_first = true;
	let data = [];

	for (let i in list)
	{
		let row = encode_row(list[i], {
			row_first: row_first,
		})

		row_first = false;

		data.push(row);

		//console.log(row);
	}

	return Cheat.toBuffer(data);
}

function encode_row(source, options)
{
	options = options || {};

	let data = [
		source.active ? CHT_ENABLE : CHT_DISABLE,
		source.value ? Cheat.buffer_from(source.value, 'hex') : Cheat.CHT_NULL,
		Cheat.buffer_from(source.address, 'hex').reverse(),

		Cheat.CHT_NULL,
		options.row_first ? 0xfe : Cheat.CHT_NULL,
		options.row_first ? 0xfc : Cheat.CHT_NULL,

		Cheat.desc_encode(source.desc || '', DESC_MAXBYTE),
	];

	data = data.concat(Array(ROW_PAD).fill(Cheat.CHT_NULL));

	return Cheat.toBuffer(data);
}

function decode(buffer, options)
{
	let idx = 0;
	let count = buffer.length / ROW_BYTE;

	let list = [];
	let error = null;

	//console.log(idx, count);

	for (let i = 0; i < count; i++)
	{
		let row = buffer.slice(i * ROW_BYTE, (i + 1) * ROW_BYTE);

		let data = decode_row(row);

		if (data.error)
		{
			error = (error || 0) + data.error;
		}

		list.push(data);
	}

	return {
		error: error,
		data: list,
		size: Cheat.buffer_size(buffer),
		maxbyte: ROW_BYTE,
		source: buffer
	};
}

function decode_row(buffer, options)
{
	let data = {};
	let idx = 0;

	let error = 0;

	data.source = buffer;

	buffer = Cheat.buffer_from(buffer);

	//console.log('_decode_row:s', buffer);

	_set_data(data, 'active', buffer[idx] == CHT_ENABLE, buffer[idx]);
	idx += 1;

	let value = buffer.slice(idx, ++idx);
	_set_data(data, 'value', value.toString('hex').toUpperCase(), value);

	let address = buffer.slice(idx, idx += 3).reverse();
	_set_data(data, 'address', address.toString('hex').toUpperCase(), address);

	if (buffer[idx] != Cheat.CHT_NULL)
	{
		error++;
	}

	let desc = buffer.slice(idx += 3, idx += DESC_MAXBYTE);
	let i2 = desc.indexOf(Cheat.CHT_NULL);
	if (i2 != -1)
	{
		desc = desc.slice(0, i2);
		i2 = idx - (DESC_MAXBYTE - i2);
	}
	else
	{
		i2 = idx;
	}
	_set_data(data, 'desc', desc.toString(), desc);

	//console.error(i2, buffer.slice(i2, buffer.length))

	for (++i2; i2 < buffer.length; i2++)
	{
		if (buffer[i2] != Cheat.CHT_NULL)
		{
			//console.error([buffer, i2, buffer.slice(i2, i2+1)]);
			error++;
			break;
		}
	}

	if (error)
	{
		data.error = error;
	}

	//console.log(data);

	//console.log('_decode_row:e', buffer);

	return data;
}

function _set_data(data, key, value, source)
{
	data[key] = value;
	//data[key + '_byte'] = source;
}