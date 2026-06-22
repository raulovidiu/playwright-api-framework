import { test as base } from "@playwright/test";
import { apiRequest as apiRequestOriginal } from "../plain-function.js";
import type {
	ApiRequestFn,
	ApiRequestMethods,
	ApiRequestParams,
	ApiRequestResponse,
} from "../schemas/type-guards.js";

/**
 * Same apiRequest contract as api-request-fixture.ts, but backed by
 * `context.request` instead of the standalone `request` fixture.
 *
 * Why: `context.request` shares the cookie jar with `page` (same
 * BrowserContext), so any session cookie the server sets (see
 * server.js -> ensureSession) is visible to both the API call and
 * the page. The standalone `request` fixture does NOT share cookies
 * with `page`, so API calls made through it land in a different
 * server-side session than what the UI is looking at.
 *
 * Use this fixture (via test-options.ts) in UI specs. Keep using
 * api-request-fixture.ts as-is for pure API specs, where there's no
 * `page`/browser context to stay in sync with.
 */
export const test = base.extend<ApiRequestMethods>({
	apiRequest: async ({ context }, use) => {
		const apiRequestFn: ApiRequestFn = async <T = unknown>({
			method,
			url,
			baseUrl,
			body = null,
			headers,
		}: ApiRequestParams): Promise<ApiRequestResponse<T>> => {
			const response = await apiRequestOriginal({
				request: context.request,
				method,
				url,
				...(baseUrl !== undefined && { baseUrl }),
				body,
				...(headers !== undefined && { headers }),
			});
			return {
				status: response.status,
				body: response.body as T,
			};
		};
		await use(apiRequestFn);
	},
});
