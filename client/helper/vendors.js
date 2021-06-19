import $ from 'jquery';

export async function queryVendors(query) {
	return (
		(await $.ajax({
			url: '/api/vendor/find',
			method: 'POST',
			data: query,
			error: console.error
		})) || []
	);
}
