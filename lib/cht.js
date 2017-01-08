/**
 * Created by user on 2017/1/7.
 */

//const CHT_ENABLE = 0x00;
//const CHT_DISABLE = 0x04;
const CHT_ENABLE = 0x08;
const CHT_DISABLE = 0x0c;

const CHT_NULL = 0x00;

const ROW_BYTE = 28;

const CHT_EX = 0;

const ROW_PAD = 2;
const DESC_MAXBYTE = 18;

const ROW_PAD_EX = 0;
const DESC_MAXBYTE_EX = 20;

var Cheat = function ()
{

};

Object.assign(Cheat, {

		CHT_ENABLE: CHT_ENABLE,
		CHT_DISABLE: CHT_DISABLE,
		DESC_MAXBYTE: CHT_EX ? DESC_MAXBYTE_EX : DESC_MAXBYTE,
		ROW_BYTE: ROW_BYTE,

		ROW_PAD: CHT_EX ? ROW_PAD_EX : ROW_PAD,
		CHT_NULL: CHT_NULL,

		code_hex(code, val, type)
		{
			return this.dechex(this.hexdec(code)) + this.dechex(type == 'dec' ? val : this.hexdec(val))
		},

		code_data(code, desc, active)
		{
			let data = code;

			if (typeof code == 'string' || typeof code.code == 'undefined')
			{
				data = {
					code: code + '',
					desc: desc,
					active: active,
				};
			}
			else if (desc === false || desc === null)
			{
				data.maxbyte = desc;
			}

			if (typeof data.code == 'number')
			{
				data.code = this.dechex(data.code);
			}

			if (typeof data.address == 'number')
			{
				data.address = this.dechex(data.address);
			}

			if (typeof data.value == 'number')
			{
				data.value = this.dechex(data.value);
			}

			if (typeof data.value == 'string')
			{
				data.address = data.address || data.code;
				data.code = data.address + data.value;
			}

			//console.log(data);

			if (data.maxbyte !== false && data.maxbyte !== null)
			{
				if (typeof data.maxbyte !== 'number')
				{
					data.maxbyte = this.DESC_MAXBYTE;
				}

				data.desc = this.str_cutbyte(data.desc, data.maxbyte);
			}

			data.active = !!data.active;

			return data;
		},

		desc_encode(desc, maxbyte)
		{
			let data;

			if (maxbyte)
			{
				data = Buffer.alloc(maxbyte);
				data.write(desc);
			}
			else
			{
				data = this.buffer_from(desc);
			}

			return data;
		},

		code_encode(code, desc, active)
		{
			if (typeof code != 'string')
			{
				let data = this.code_data(code);

				code = data.code;
				desc = this.desc_encode(data.desc, data.maxbyte);
				active = data.active;
			}

			var arr = [
				(active === this.CHT_ENABLE || !!active) ? this.CHT_ENABLE : this.CHT_DISABLE,
				Buffer.from(code, 'hex').reverse(),
				0,
				254,
				252,
				desc,
				/*
				 0,
				 0,
				 */
			];

			arr = arr.concat(Array(this.ROW_PAD).fill(this.CHT_NULL));

			return this.toBuffer(arr);

			/*
			 for (let i in arr)
			 {
			 if (!Buffer.isBuffer(arr[i]))
			 {
			 console.log(i, arr[i]);
			 arr[i] = Buffer.from([arr[i]])
			 }
			 }
			 */

			/*
			 arr.push(Buffer.from([!!active ? 0 : 4]));
			 arr.push(Buffer.from(code, 'hex').reverse());
			 arr.push(Buffer.from([0]));
			 arr.push(Buffer.from([254, 252]));
			 arr.push(Buffer.from(name, 'utf8'));
			 arr.push(Buffer.from([0]));
			 arr.push(Buffer.from([0]));
			 */

			//return Buffer.concat(arr);
		},

		encode(source)
		{
			code_encode(code, desc, active)
		},

		decode(data)
		{

			let idx = 0;
			let len = data.length;

			let list = [];

			let error = false;
			let desc_size_last = null;
			let desc_size_chk = null;

			//console.log([len, data]);

			while ((idx + 4) < len)
			{
				//let active = ord(data.slice(idx, ++idx));
				let active = data[idx++] == this.CHT_ENABLE;

				let value = data.slice(idx, ++idx);
				let address = data.slice(idx, idx += 3).reverse();
				let desc = '';

				idx += 3;

				if (len <= idx + this.ROW_PAD)
				{
					error = true;
				}

				let iii = idx;
				let i;

				for (i = idx; i < len; i++)
				{
					//console.log(i, data[i], data.slice(i, i+1).toString('hex'));

					if (data[i] == this.CHT_NULL || data[i] == this.CHT_ENABLE || data[i] == this.CHT_DISABLE)
					{
						desc = data.slice(idx, i).toString();

						//idx = i + 2;
						//idx = i+1;
						idx = i + (this.ROW_PAD ? 0 : 1);

						break;
					}
					else if ((i + 1) == len)
					{
						desc = data.slice(idx, i).toString();

						//idx = i + 2;
						//idx = i+1;
						idx = len;
					}
				}

				//console.log('aaa', i, idx);

				if (i <= idx)
				{
					let row = Cheat.code_data({
							code: address.toString('hex').toUpperCase() + value.toString('hex').toUpperCase(),
							address: address.toString('hex').toUpperCase(),
							value: value.toString('hex').toUpperCase(),
							desc: desc,
							active: active,
							//maxbyte: false
						}, null
					);

					//list.push([active, address.toString('hex').toUpperCase(), value.toString('hex').toUpperCase(), desc]);

					//console.log(i, idx, iii, data[idx], (idx+1) >= len);

					if (data[idx] == this.CHT_DISABLE)
					{
						row.desc_size = idx - this.ROW_PAD - iii;
					}
					else if ((idx + 1) >= len)
					{
						row.desc_size = len - this.ROW_PAD - iii;
					}
					else
					{
						for (i = idx; i < len; i++)
						{
							if (data[i] != this.CHT_NULL)
							{
								if (data[i] != this.CHT_DISABLE)
								{
									i--;
								}

								if (data[i - this.ROW_PAD] == this.CHT_NULL)
								{
									row.desc_size = i - this.ROW_PAD - iii;
								}

								idx = i;

								break;
							}
						}

						if (typeof row.desc_size == 'undefined')
						{
							row.desc_size = i - this.ROW_PAD - iii;
						}
					}

					if (desc_size_chk !== false)
					{
						if (desc_size_last !== null)
						{
							desc_size_chk = (desc_size_last == row.desc_size)
						}

						desc_size_last = row.desc_size;
					}

					list.push(row);
				}
				else
				{
					error = true;

					break;
				}

				//console.log(i <= len, idx <= len, i, idx);

				//console.log([active, address.toString('hex').toUpperCase(), value.toString('hex').toUpperCase(), name]);
			}

			error = error || idx > len;

			//console.log(error, idx, data[idx]);

			//console.log(list);

			return {
				error: error,
				data: list,
				size: this.buffer_size(data),
				maxbyte: desc_size_chk ? desc_size_last : desc_size_chk,
				source: data
			};
		},

		hexdec(hex)
		{
			return parseInt('0x' + hex);
		},

		dechex(d, byte)
		{
			let s = '';
			let n = 2;

			if (d > 0)
			{
				s = (+d).toString(16).toUpperCase();
				if (n = s.length % 2)
				{
					n = (byte || 1) * 2 - n;
				}
			}

			return '0'.repeat(n) + s;
		},

		buffer_from(data, encoding)
		{
			if (typeof data == 'number')
			{
				return Buffer.from([data], encoding);
			}

			return Buffer.from(data, encoding);
		},

		toBuffer(data, deep)
		{
			if (Buffer.isBuffer(data))
			{
				return data;
			}

			if (!Array.isArray(data))
			{
				return this.buffer_from(data);
			}

			let arr = data;
			if (deep === true)
			{
				deep = 1;
			}

			for (let i in arr)
			{
				if (!Buffer.isBuffer(arr[i]))
				{
					if (deep > 0 && Array.isArray(arr[i]))
					{
						arr[i] = this.toBuffer(arr[i], deep - 1);
					}
					else
					{
						arr[i] = this.buffer_from(arr[i]);
					}
				}
			}

			return Buffer.concat(arr);
		},

		buffer_size(data)
		{
			return data.toString('ascii').length;
		},

		str_byte(str)
		{
			return Buffer.byteLength(str);
		},

		str_cutbyte(s, maxbyte)
		{
			if (maxbyte === true || !maxbyte || typeof maxbyte !== 'number')
			{
				maxbyte = this.DESC_MAXBYTE;
			}

			let data = Buffer.alloc(maxbyte);
			data.write(s);

			let i = data.indexOf(0x00);

			if (i > -1)
			{
				data = data.slice(0, i);
			}

			return data.toString();

			/*
			 s = s.substr(0, maxbyte);

			 let bytes = this.str_byte(s);

			 if (bytes > maxbyte)
			 {
			 let d = bytes - maxbyte;

			 for (let i = 1; i < d; i++)
			 {
			 let c = s.substr(-i);
			 let b = this.str_byte(c);

			 //console.log(c, b);

			 if (b >= d)
			 {
			 s = s.substr(0, s.length - i);

			 break;
			 }
			 }
			 }

			 return s;
			 */
		},

		buffer_is_valid_cht(source, strict)
		{
			if (!source)
			{
				return null;
			}

			let data = Buffer.isBuffer(source) ? this.decode(source) : source;

			//console.log(data);

			if (!data.data || !data.data.length || !data.size || !data.source)
			{
				return false;
			}

			strict = typeof strict === 'undefined' ? true : strict;

			data.strict = false;

			if (!(data.size % this.ROW_BYTE) && !data.error && data.maxbyte === this.DESC_MAXBYTE)
			{
				data.strict = true;
			}

			if (strict)
			{
				return data.strict ? data : false;
			}

			return data;
		},

	}
);

module.exports = Cheat;