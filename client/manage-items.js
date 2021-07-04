import { queryVendors } from './helper/vendors';
import { queryItems, updateItem, createItem, deleteItem } from './helper/items';
import { setAdminMode, ADMIN_MODE } from './dashboard';
import confirmAction from './confirmation';

function setupHandlers() {
	$('#iim-cancelBtn').on('click', (e) => {
		closeEditItemModal();
	});

	$('#iim-cornerCloseBtn').on('click', (e) => {
		closeEditItemModal();
	});

	$('#searchboxTxt').on('change', (e) => {
		const query = $('#searchboxTxt').val()?.toString() ?? '';
		populateItemList(new RegExp(query));
	});

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

		$('#iim-deleteBtn').addClass('is-hidden');
		$('#iim-title').text('New Item');
		$('#iim-itemnameTxt').val('').on('keyup', stateChanged);
		$('#iim-unitnameTxt').val('');
		$('#iim-saveBtn').text('Create Item').prop('disabled', true);

		$('#inspectItemModal').addClass('is-active');

		// unbind any old click routines
		$('#iim-saveBtn').off('click');
		$('#iim-deleteBtn').off('click');

		// bind updated item save routine to create an item insted of updating one
		$('#iim-saveBtn').on('click', async (e) => {
			// get selected vendor id
			const idx = $('#iim-vendorSelect').prop('selectedIndex');
			const vendor = $(`#iim-vendorSelect option:nth-child(${idx + 1})`).attr(
				'vendorid'
			);

			const name = $('#iim-itemnameTxt').val();
			let unitName = $('#iim-unitnameTxt').val();

			// if no unit was specified, use mongoose default (units)
			if (unitName == '') unitName = undefined;

			await createItem(name, vendor, unitName);

			location.reload();
		});
	});
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

function closeEditItemModal() {
	$('#iim-saveBtn').off('click'); // unbind handlers
	$('#iim-deleteBtn').off('click'); // unbind handlers
	$('#iim-deleteBtn').removeClass('is-hidden'); // show delete button
	$('#inspectItemModal').addClass('is-closing');
	setTimeout(
		() => $('#inspectItemModal').removeClass('is-closing is-active'),
		240
	);
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
	$('#iim-deleteBtn').off('click');

	$('#iim-saveBtn').text('Save Changes');

	// define item update routine
	$('#iim-saveBtn').on('click', (e) => {
		itemSaveBtnClick(item);
	});

	// define item delete routine
	$('#iim-deleteBtn').on('click', (e) => {
		itemDeleteBtnClick(item);
	});
}

async function itemSaveBtnClick(item) {
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
}

async function itemDeleteBtnClick(item) {
	confirmAction(
		`Delete <span class="tag">${item.name}</span> supplied by ${item.vendor.name}? This action will remove any entries on any lists that reference this item.`,
		async () => {
			await deleteItem(item._id);
			location.reload();
		},
		() => closeEditItemModal()
	);
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
	setAdminMode(ADMIN_MODE.Items);
	setupHandlers();

	await populateItemList(/.*/);
});
