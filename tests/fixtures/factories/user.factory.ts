import { faker } from "@faker-js/faker";

/**
 * Generates a valid registration payload for POST /api/register.
 * All fields are dynamically generated per call to ensure test isolation.
 *
 * @returns {{ email: string; password: string; name: string }}
 */
export const createRegisterPayload = (): {
	email: string;
	password: string;
	name: string;
} => ({
	email: faker.internet.email(),
	password: faker.internet.password({ length: 12, memorable: false }),
	name: faker.person.fullName(),
});

/**
 * Generates a payload with a missing email field.
 */
export const createPayloadWithoutEmail = (): {
	password: string;
	name: string;
} => ({
	password: faker.internet.password({ length: 12 }),
	name: faker.person.fullName(),
});

/**
 * Generates a payload with a missing password field.
 */
export const createPayloadWithoutPassword = (): {
	email: string;
	name: string;
} => ({
	email: faker.internet.email(),
	name: faker.person.fullName(),
});

/**
 * Generates a payload with a missing name field.
 */
export const createPayloadWithoutName = (): {
	email: string;
	password: string;
} => ({
	email: faker.internet.email(),
	password: faker.internet.password({ length: 12 }),
});

/**
 * Generates a payload with a syntactically invalid email.
 */
export const createPayloadWithInvalidEmail = (): {
	email: string;
	password: string;
	name: string;
} => ({
	email: faker.lorem.word(), // e.g. "banana" — no @, no domain
	password: faker.internet.password({ length: 12 }),
	name: faker.person.fullName(),
});
