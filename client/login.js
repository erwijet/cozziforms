import $ from 'jquery';
import md5 from './helper/hashing';

const params = new URLSearchParams(globalThis.window.location.search);

function shakeWindow() {
	$('#loginBox').removeClass('shake');
	setTimeout(() => $('#loginBox').addClass('shake'), 50);
}

function validate(usr, pas) {
	$('#loginButton').addClass('is-loading');
	$.ajax({
		url: '/api/user/authenticate',
		dataType: 'json',
		contentType: 'application/json',
		method: 'POST',
		data: JSON.stringify({
			username: usr,
			hash: pas
		}),
		success: (res) => {
			if (!res?.auth) {
				shakeWindow();
				setTimeout(() => {
					$('#usernameTextbox').val('').addClass('is-danger');
					$('#passwordTextbox').val('').addClass('is-danger');
					$('#errorText').removeClass('is-hidden');
					$('#loginButton').removeClass('is-loading');
				}, 200);
			} else globalThis.window.location.replace(params.get('rdr') || '/');
		}
	});
}

$(() => {
	$('#loginForm').on('submit', async (e) => {
		e.preventDefault();
		const username = $('#usernameTextbox').val();
		const rawPass = $('#passwordTextbox').val();

		const hashedPass = md5(rawPass);
		validate(username, hashedPass);
	});
});
