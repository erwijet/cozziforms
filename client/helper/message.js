export default function makeMsg(title, body, parent = $('body')) {
	const msgContainer = $('<article>').addClass('message is-primary');
	const msgHeader = $('<div>').addClass('message-header');
	const msgHeaderContent = $('<p>').text(title);

	const msgHeaderCloseBtn = $('<button>')
		.addClass('delete')
		.attr('aria-label', 'delete');

	const msgBody = $('<div>').text(body);

	msgHeaderContent.appendTo(msgHeader);
	msgHeaderCloseBtn.appendTo(msgHeader);

	msgHeader.appendTo(msgContainer);
	msgBody.appendTo(msgContainer);

	msgContainer.appendTo(parent);
}
