import * as v from 'valibot';

export function validateFormData(formData: unknown) {
	const formSchema = v.strictObject({
		name: v.pipe(
			v.string(),
			v.minLength(1, 'Name must be included'),
			v.maxLength(128, 'Name cannot be longer than 128 characters'),
		),
		email: v.pipe(v.string(), v.email('Email must be valid')),
		message: v.pipe(
			v.string(),
			v.minLength(1, 'Must include a message'),
			v.maxLength(1_000, 'Messge must not be longer than 1,000 characters'),
		),
	});

	const validationResult = v.safeParse(formSchema, formData);

	return validationResult;
}
