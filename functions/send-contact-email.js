export async function onRequestPost({ request, env }) {
	const requestBody = await request.formData();

	// Verify required form data is present
	const formDataVerified = verifyFormData(requestBody);

	if (!formDataVerified) {
		return new Response(JSON.stringify({ message: 'Contents of form not valid' }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400,
		});
	}

	// Verify Turnstile token
	const turnstileVerified = await verifyTurnstileToken(
		env.TURNSTILE_SECRET_KEY,
		requestBody.get('token'),
	);

	if (!turnstileVerified) {
		return new Response(JSON.stringify({ message: 'Verification failed' }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400,
		});
	}

	// Send email
	const body =
		`You have a new contact form submission from ` +
		requestBody.get('name').toString().slice(0, 128) +
		` (${requestBody.get('email').toString().slice(0, 128)}). The message is: \n\n` +
		requestBody.get('message').toString().slice(0, 1000);
	const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
		},
		body: JSON.stringify({
			personalizations: [
				{
					to: [{ email: env.CONTACT_EMAIL }],
				},
			],
			from: { email: env.FROM_EMAIL },
			subject: 'Dev Portfolio Contact Form Submission',
			content: [
				{
					type: 'text/plain',
					value: body,
				},
			],
		}),
	});

	return new Response(JSON.stringify({ message: 'Form submitted' }), {
		headers: { 'Content-Type': 'application/json' },
		status: response.ok ? 202 : 400,
	});
}

/**
 * Verify that required data for contact form submission was included and satisfies requirements
 *
 * @param {FormData}  formData The submitted data to verify
 *
 * @returns {Boolean} True if the data is acceptable for submission, false otherwise
 */
function verifyFormData(formData) {
	const name = formData.get('name');
	const email = formData.get('email');
	const message = formData.get('message');
	const token = formData.get('token');

	// Ensure all required fields were filled and Turnstile token is present
	if ([name, email, message, token].includes(null)) {
		return false;
	}
	// Ensure all fields fit within character limits
	else if (
		name.toString().length == 0 ||
		name.toString().length > 128 ||
		email.toString().length == 0 ||
		email.toString().length > 128 ||
		message.toString().length == 0 ||
		message.toString().length > 1000
	) {
		return false;
	}

	return true;
}

/**
 * Verify a submitted Turnstile token
 *
 * @param {String}    secretKey The Turnstile secret key to use
 * @param {String}    token The token sent with the submission request
 *
 * @returns {Boolean} True if token verification succeeded, false if not
 */
async function verifyTurnstileToken(secretKey, token) {
	let verificationFormData = new FormData();

	verificationFormData.append('secret', secretKey);
	verificationFormData.append('response', token);

	return fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: verificationFormData,
	})
		.then(response => response.json())
		.then(data => data.success === true);
}
