export default function confirmAction(prompt, onYes, onNo = () => {}) {
	// assert confirmation-modal.pug is loaded
	if ($('#confirmModal').length == 0)
		return console.log(
			'Unable to find #confirmModal. Is confirmation-modal.pug included?'
		);

	// close all other current modals so elements don't overlap
	$('.modal').each((_, elem) => {
		$(elem).removeClass('is-active');
	});

	$('#cnfrm-prompt').html(prompt);
	$('#cnfrm-cornerCloseBtn').on('click', (e) => {
		$('#confirmModal').removeClass('is-active');
	});

	$('#cnfrm-yes')
		.off('click')
		.on('click', (e) => {
			$('#confirmModal').removeClass('is-active');
			onYes();
		});
	$('#cnfrm-no')
		.off('click')
		.on('click', (e) => {
			$('#confirmModal').removeClass('is-active');
			onNo();
		});

	$('#confirmModal').addClass('is-active');
}
