import { test as base, request } from "@playwright/test";
import { test as apiRequestFixture } from "../api/api-request-fixture.js";

/**
 * Entry point for PURE API specs (no `page`, no browser, no UI).
 *
 * Uses the standalone `request` fixture under the hood — no
 * BrowserContext is created, so there's no browser launch overhead.
 * `apiRequest` here is NOT cookie-synced with any `page`, which is
 * exactly right for API-only specs where there's no UI to sync with.
 *
 * Import API specs from this file, e.g.:
 *   import { expect, test } from "@/fixtures/pom/test-options.api.js";
 *   const { status, body } = await apiRequest<CheckoutResponse>({...});
 *
 * For UI specs (anything using `page`, `cartPage`, etc.), import from
 * test-options.ts instead — that one binds apiRequest to context.request
 * so API setup calls stay in the same session as the browser.
 */
const test = apiRequestFixture;

const expect = base.expect;

export { expect, request, test };
