import { z } from 'zod';

export function validateFormData(formData: unknown) {
	const formValidator = z.strictObject({
		name: z
			.string()
			.min(1, { error: 'Name must be included' })
			.max(128, { error: 'Name cannot be longer than 128 characters' }),
		email: z.email({ error: 'Email must be valid' }),
		message: z
			.string()
			.min(1)
			.max(1000, { error: 'Message must not be longer than 1,000 characters' }),
	});

	const validationResult = formValidator.safeParse(formData);

	return validationResult;
}
