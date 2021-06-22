import { queryVendors } from './helper/vendors';
import { queryItems, updateItem } from './helper/items';

const ADMIN_MODE = {
	Items: 1,
	Vendors: 2,
	Users: 3
};

let curAdminMode = ADMIN_MODE.Items;

function setupHandlers() {
	$('#items-tab').on('click', (e) => setAdminMode(ADMIN_MODE.Items));
	$('#vendors-tab').on('click', (e) => setAdminMode(ADMIN_MODE.Vendors));
	$('#users-tab').on('click', (e) => setAdminMode(ADMIN_MODE.Users));

	$('#iim-deleteBtn').on('click', (e) => {
		$('#inspectItemModal').removeClass('is-active');
	});

	$('#searchboxTxt').on('change', (e) => {
		const query = $('#searchboxTxt').val()?.toString() ?? '';
		populateItemList(new RegExp(query));
	});
}

function setAdminMode(mode) {
	$('#tabs-ul')
		.find(`li:nth-child(${curAdminMode})`)
		.removeClass('has-text-primary is-active');
	$('#tabs-ul')
		.find(`li:nth-child(${mode})`)
		.addClass('has-text-primary is-active');
	console.log($('#tabs-ul').find(`:nth-child(${mode})`).find(':nth-child(1)'));

	console.log(curAdminMode, mode);
	curAdminMode = mode;
}

async function populateVendorSelect() {
	const vendors = await queryVendors({});
	const vendorSelect = $('#iim-vendorSelect');

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

async function launchEditItemModal(item) {
	await populateVendorSelect();
	$('#iim-itemnameTxt').val(item.name);
	$('#iim-unitnameTxt').val(item.unitName);
	$(`#iim-vendorSelect option[vendorid=${item.vendor._id}]`).attr(
		'selected',
		'selected'
	);

	$('#inspectItemModal').addClass('is-active');

	$('#iim-saveBtn').on('click', async (e) => {
		await updateItem(item._id.tpString(), {
			name: $('#iim-itemnameTxt').val(),
			unitName: $('#iim-unitnameTxt').val(),
			vendor: $('#iim-vendorSelect').val()
		});
		$('#inspectItemModal').removeClass('is-active');
	});
}

/**

 * @param item The document to append. Should be an IItem with a populated vendor path
 */
function appendItemToTable(item) {
	const itemTableBody = $('#itemTable').find('tbody');
	const newRow = $('<tr>')
		.attr('itemid', item._id)
		.on('click', (e) => {
			launchEditItemModal(item);
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
	setupHandlers();

	await populateItemList(/.*/);
	// await populateVendorSelect();
	// await populateItemList(/.*/);
});
