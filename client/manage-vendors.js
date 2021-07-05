import { setAdminMode, ADMIN_MODE } from './dashboard';
import { queryVendors } from './helper/vendors';
import { queryItems } from './helper/items';

let itemsCache;

async function getItems() {
	if (!itemsCache) itemsCache = await queryItems({});
	return itemsCache;
}

async function appendTableRow(vendor) {
	const items = await getItems();
	const asscItemCount = items.filter(
		(item) => item.vendor._id == vendor._id
	).length;

	const tableBody = $('#vendorTable').find('tbody');
	const row = $('<tr>');

	$('<td>').text(vendor.name).appendTo(row);
	$('<td>').text(asscItemCount).appendTo(row);

	row.appendTo(tableBody);
}

async function populateVendorList(regex) {
	const query = {
		name: {
			$regex: regex.source,
			$options: 'i'
		}
	};

	const vendors = await queryVendors(query);

	for (let vendor of vendors) {
		appendTableRow(vendor);
	}
}

$(async () => {
	setAdminMode(ADMIN_MODE.Vendors);
	await populateVendorList(/.*/);
});
