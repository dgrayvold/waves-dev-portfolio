import { Resend } from 'resend';
import { validateFormData } from '~/utils/validation';

export default defineEventHandler(async event => {
	const { requestData, token } = await readBody(event);

	const formValidationResult = validateFormData(requestData);

	if (!formValidationResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid submission',
		});
	}

	const tokenValidationResult = await verifyTurnstileToken(token);

	if (!tokenValidationResult.success) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Could not verify token',
		});
	}

	const runtimeConfig = useRuntimeConfig();
	const resend = new Resend(runtimeConfig.resendKey);
	const { name, email, message } = formValidationResult.data;
	const text = `You have a new contact form submission from ${name} at ${email}. The message is: \n\n${message}`;

	const { error: emailError } = await resend.emails.send({
		from: `NoReply <${runtimeConfig.fromEmail}>`,
		to: [runtimeConfig.toEmail],
		subject: 'Dev Portfolio Contact Form Submission',
		text,
	});

	if (emailError) {
		throw createError({
			statusCode: 500,
			statusMessage: emailError.message,
		});
	}
});
