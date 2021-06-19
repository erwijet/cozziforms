import { ajax } from 'jquery';
import { IItem } from '../../api/models/item.model';

export async function queryItems(query): Promise<IItem[]> {
	return (
		(await ajax({
			url: '/api/item/find',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(query),
			error: console.error
		})) ?? []
	);
}
