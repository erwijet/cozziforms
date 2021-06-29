export const ADMIN_MODE = {
	Items: 1,
	Vendors: 2,
	Users: 3
};

export let curAdminMode = ADMIN_MODE.Items;

export function setAdminMode(mode) {
	$('#tabs-ul')
		.find(`li:nth-child(${curAdminMode})`)
		.removeClass('has-text-primary is-active');
	$('#tabs-ul')
		.find(`li:nth-child(${mode})`)
		.addClass('has-text-primary is-active');

	curAdminMode = mode;
}
