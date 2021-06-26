import { queryVendors } from './helper/vendors';
import { queryItems, updateItem, createItem } from './helper/items';

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

	console.log($('#newitemBtn'));

	$('#newitemBtn').on('click', async (e) => {
		// setup inspect item modal to create an item

		function stateChanged(e) {
			// called any time the vendor select or name textbox is changed
			const vendorIsSelected =
				$('#iim-vendorSelect').prop('selectedIndex') != 0;
			const nameIsSelected = $('#iim-itemnameTxt').val() != '';

			$('#iim-saveBtn').prop('disabled', !vendorIsSelected || !nameIsSelected);
		}

		await populateVendorSelect();
		$('#iim-vendorSelect')
			.prepend($('<option value="" disabled>Select a Vendor</option>'))
			.prop('selectedIndex', 0)
			.on('change', stateChanged);

		$('#iim-title').text('New Item');
		$('#iim-itemnameTxt').val('').on('keyup', stateChanged);
		$('#iim-unitnameTxt').val('');
		$('#iim-saveBtn').text('Create Item').prop('disabled', true);

		$('#inspectItemModal').addClass('is-active');

		$('#iim-saveBtn').off('click'); // unbind any old save routine

		// bind updated item save routine to create an item insted of updating one
		$('#iim-saveBtn').on('click', async (e) => {
			// get selected vendor id
			const idx = $('#iim-vendorSelect').prop('selectedIndex');
			const vendor = $(`#iim-vendorSelect option:nth-child(${idx + 1})`).attr(
				'vendorid'
			);

			await updateItem(item._id.toString(), {
				name: $('#iim-itemnameTxt').val(),
				unitName: $('#iim-unitnameTxt').val(),
				vendor
			});

			$('#inspectItemModal').removeClass('is-active');

			location.reload();
		});
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
	$('#iim-title').text('Inspect Item');
	$('#iim-itemnameTxt').val(item.name);
	$('#iim-unitnameTxt').val(item.unitName);

	$('#iim-vendorSelect').prop('value', item.vendor.name);

	$('#inspectItemModal').addClass('is-active');

	// remove any old click handlers
	$('#iim-saveBtn').off('click');

	// define item update routine
	$('#iim-saveBtn').on('click', async (e) => {
		// get selected vendor id
		const idx = $('#iim-vendorSelect').prop('selectedIndex');
		const vendor = $(`#iim-vendorSelect option:nth-child(${idx + 1})`).attr(
			'vendorid'
		);

		await updateItem(item._id.toString(), {
			name: $('#iim-itemnameTxt').val(),
			unitName: $('#iim-unitnameTxt').val(),
			vendor
		});

		$('#inspectItemModal').removeClass('is-active');

		location.reload();
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
