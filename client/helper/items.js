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
