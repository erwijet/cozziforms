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
	// include itemId in the fields object
	fields.itemId = itemId;

	// send update request to API
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
