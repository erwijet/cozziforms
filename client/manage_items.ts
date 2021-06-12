import $ from 'jquery';

$(() => {
	$('#newitemBtn').on('click', (e) => {
		e.preventDefault();
		$('#tableColumn').addClass('animate');
		$('.excludeWhenSmall').each((_, elem) => {
			$(elem).addClass('animate');
			setTimeout(() => {
				$(elem).addClass('is-hidden');
			}, 0);
		});

		setTimeout(() => {
			$('#tableColumn').removeClass('animate').addClass('is-half');
		}, 400);
	});
});
