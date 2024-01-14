interface Env {
	TURNSTILE_SECRET_KEY: string;
	FROM_EMAIL: string;
	CONTACT_EMAIL: string;
	RESEND_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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

	const body =
		`You have a new contact form submission from ` +
		requestBody.get('name').toString().slice(0, 128) +
		` (${requestBody.get('email').toString().slice(0, 128)}). The message is: \n\n` +
		requestBody.get('message').toString().slice(0, 1000);

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.RESEND_KEY}`,
		},
		body: JSON.stringify({
			from: `NoReply <${env.FROM_EMAIL}>`,
			to: [env.CONTACT_EMAIL],
			subject: 'Dev Portfolio Contact Form Submission',
			text: body,
		}),
	});

	return new Response(
		JSON.stringify({ message: 'Form submitted', data: await response.json() }),
		{
			headers: { 'Content-Type': 'application/json' },
			status: response.ok ? 202 : 400,
		},
	);
};

/**
 * Verify that required data for contact form submission was included and satisfies requirements
 *
 * @param formData The submitted data to verify
 *
 * @returns  True if the data is acceptable for submission, false otherwise
 */
function verifyFormData(formData: FormData) {
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
 * @param secretKey The Turnstile secret key to use
 * @param token The token sent with the submission request
 *
 * @returns True if token verification succeeded, false if not
 */
async function verifyTurnstileToken(secretKey: string, token: string) {
	const verificationFormData = new FormData();

	verificationFormData.append('secret', secretKey);
	verificationFormData.append('response', token);

	return fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: verificationFormData,
	})
		.then(response => response.json())
		.then(({ success }: { success: boolean }) => success === true);
}
