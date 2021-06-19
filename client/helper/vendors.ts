import $ from 'jquery';
import { IVendor } from '../../api/models/vendor.model';

export async function queryVendors(query): Promise<IVendor[]> {
	return (
		(await $.ajax({
			url: '/api/vendor/find',
			method: 'POST',
			data: query,
			error: console.error
		})) ?? []
	);
}
