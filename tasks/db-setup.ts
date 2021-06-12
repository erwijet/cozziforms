// db-setup.ts
// Tyler Holewinski
//
// note: this is total spaguet code,
// to be honest, I dont even really know how or why it works.
// Im sorry im such a trash programmer, but this script took me like,
// 5 hours of nonstop head bashing, followed with Ctrl + A, Delete.
// So yeahhhh...

//
// This script deletes the contents of the Vendors, Items, and Categories table
// and rebuilds their contents according to a spec sheet provided
// the syntax of the sheet is:
//
// ;					-> ignore line / comment
// # <vendorname>		-> all following items will be members of specified vendor
// : <category name>	-> all following items will be members of specified category (this is stackable)
// ::					-> exit category block
// <itemname>			-> create an item with specified name

import { checkDBConnection } from '../api/db';

import VendorModel from '../api/models/vendor.model';
import CategoryModel from '../api/models/category.model';
import ItemModel from '../api/models/item.model';

import { Types } from 'mongoose';
import fs from 'fs';

type EncodedCategory = string;

interface EncodedItem {
	name: string;
	categories: EncodedCategory[];
}

const note = (str: string) => console.log(`[item enc.] ${str}`);

function fatal(msg: string) {
	note('FATAL, ' + msg);
	note('exiting...');
	process.exit();
}

async function resetDB() {
	await checkDBConnection();
	note('( INFO ) connected to db');
	note('( PROC ) clearing vendor list');
	await VendorModel.deleteMany({});
	note('( DONE ) ✔');
	note('( PROC ) clearing category list');
	await CategoryModel.deleteMany({});
	note('( DONE ) ✔');
	note('( PROC ) clearing item list');
	await ItemModel.deleteMany({});
	note('( DONE ) ✔');
	note('( INFO ) all lists cleared');
	note('( INFO ) DB cleaned');
}

async function encode(filepath: string, outfile: string) {
	resetDB();
	note('( PROC ) Parsing file...');
	if (!fs.existsSync(filepath)) fatal(`File ${filepath} does not exist.`);

	const lines = fs
		.readFileSync(filepath)
		.toString()
		.split('\r\n')
		.map((line) => line.trim())
		.filter((line) => line != '') // remove whitespace
		.filter((line) => line[0] != ';'); // remove comments

	let encoded: { [key: string]: any[] } = { '': [] };
	let vendor = '';
	let vendorId = new Types.ObjectId('000000000000000000000000');
	let categoryIds: Types.ObjectId[] = [];
	let lastCategory = '';
	let categories = [];

	for (let line of lines) {
		if (line[0] == '#') {
			vendor = line.substr(1).trim();

			let vendorInstance = await VendorModel.create({ name: vendor });
			await vendorInstance.save();

			vendorId = vendorInstance._id;

			note('( VEND ) set active vendor to ' + vendor);

			if (!encoded[vendor]) encoded[vendor] = [];
			continue;
		}

		if (line[0] == ':') {
			note(`( DIRC ) category directive detected [${line}]`);
			if (line[1] == ':') {
				note('( INFO ) popping...');
				categories.pop();
				categoryIds.pop();
				continue;
			}

			let newCategory = line.substr(1).trim();
			note('(CATGRY) adding ' + newCategory);

			if (!categories[0]) {
				let instance = await CategoryModel.create({
					vendor: vendorId,
					children: [],
					name: newCategory
				});
				categoryIds.push(instance._id);
				await instance.save();
			} else {
				let parent = await CategoryModel.findById(
					categoryIds[categoryIds.length - 1]
				);

				let instance = await CategoryModel.create({
					vendor: vendorId,
					children: [],
					name: newCategory
				});

				parent?.children?.push(instance._id);

				categoryIds.push(instance._id);
				await instance?.save();
				await parent?.save();
			}

			categories?.push(newCategory);
			lastCategory = newCategory;
			continue;
		}

		note(`( ITEM ) item detected ${line}`);

		const itemInstance = await ItemModel.create({
			name: line,
			vendor: vendorId
		});

		await itemInstance.save();

		note('( INFO ) item created');

		encoded[vendor].push({
			name: line,
			categories: [...categories]
		});
	}

	note('( PROC ) Writing to file...');

	fs.writeFileSync(outfile, JSON.stringify(encoded));
	note('( DONE ) ✔');
	return encoded;
}

(async () => {
	await checkDBConnection();
	await encode(__dirname + '/items.txt', __dirname + '/items.json');

	note('( DONE ) goodbye');
	process.exit();
})();
