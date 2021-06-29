import { ajax } from 'jquery';

export async function queryItems(query) {
	return (
		(await ajax({
			url: '/api/item/find',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(query),
			error: console.error
		})) || []
	);
}

export async function updateItem(itemId, fields) {
	fields.itemId = itemId;

	return (
		(await ajax({
			url: '/api/item/update',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(fields),
			error: console.error
		})) || []
	);
}

export async function createItem(name, vendorId, unitName = 'units') {
	return (
		(await ajax({
			url: '/api/item/create',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({ name, vendorId, unitName })
		})) || []
	);
}

export async function deleteItem(id) {
	return (
		(await ajax({
			url: '/api/item/delete',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({ _id: id.toString() })
		})) || []
	);
}
