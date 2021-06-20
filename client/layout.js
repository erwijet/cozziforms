function performToggle() {
	$('.navbar-burger').toggleClass('is-active');
	$('.navbar-menu').toggleClass('is-active');
}

$(() => $('.navbar-burger').on('click', (e) => performToggle()));
