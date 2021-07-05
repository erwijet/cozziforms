export async function queryVendors(query) {
	return (
		(await $.ajax({
			url: '/api/vendor/find',
			dataType: 'json',
			contentType: 'application/json',
			method: 'POST',
			data: JSON.stringify(query),
			error: console.error
		})) || []
	);
}
