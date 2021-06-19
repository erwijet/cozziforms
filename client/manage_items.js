import { queryVendors } from './helper/vendors';
import { queryItems } from './helper/items';

import $ from 'jquery';

async function populateVendorSelect() {
	const vendors = await queryVendors({});
	const vendorSelect = $('#vendorSelect');

	vendorSelect.empty();

	vendors.forEach((vendor) => {
		$('<option>')
			.text(vendor.name)
			.attr('vendorId', vendor._id)
			.appendTo(vendorSelect);
	});

	// by default, no option should be selected
	vendorSelect.prop('selectedIndex', -1);
}

/**

 * @param item The document to append. Should be an IItem with a populated vendor path
 */
function appendItemToTable(item) {
	const itemTableBody = $('#itemTable').find('tbody');
	const newRow = $('<tr>')
		.attr('itemid', item._id)
		.on('click', (e) => {
			const itemId = $(this).attr('itemid');
			$(this).addClass('is-selected');
		});

	[
		$('<td>').text(item.vendor?.name ?? 'mdb population err'),
		$('<td>').html(
			item.category?.name ?? '<span class="tag">No Category</span>'
		),
		$('<td>').text(item.name)
	].forEach((elem) => elem.appendTo(newRow));

	newRow.appendTo(itemTableBody);
}

async function populateItemList(regex) {
	const itemTableBody = $('#itemTable').find('tbody');

	itemTableBody.empty();

	console.log(regex.source, {
		name: {
			$regex: regex.source,
			$options: 'i'
		}
	});

	const items = await queryItems({
		name: {
			$regex: regex.source,
			$options: 'i'
		}
	});

	items.forEach((item) => appendItemToTable(item));
}

$(async () => {
	await populateVendorSelect();
	await populateItemList(/.*/);

	$('#searchboxTxt').on('change', (e) => {
		console.log($('#searchboxTxt'));

		const query = $('#searchboxTxt').val()?.toString() ?? '';
		console.log(query, new RegExp(query));

		populateItemList(new RegExp(query));
	});
});
