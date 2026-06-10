import { createRegisterPayload } from "../factories/user.factory.js";
import { ApiRequestResponse, RegisterResponse } from "../types-guards.js";
import { BASE_URL } from "../../../constants.js";


// Registers a fresh user and returns the payload used

export async function registerFreshUser(
	apiRequest: <T = unknown>(params: {
		method: "POST" | "GET" | "PUT" | "DELETE";
		url: string;
		baseUrl?: string;
		body?: Record<string, unknown> | null;
		headers?: string;
	}) => Promise<ApiRequestResponse<T>>,
): Promise<{ email: string; password: string; name: string }> {
	const payload = createRegisterPayload();

	const { status } = await apiRequest<RegisterResponse>({
		method: "POST",
		url: "/api/register",
		baseUrl: BASE_URL,
		body: payload,
	});

	if (status !== 201) {
		throw new Error(
			`Pre-condition failed: /api/register returned ${status} instead of 201`,
		);
	}

	return payload;
}
