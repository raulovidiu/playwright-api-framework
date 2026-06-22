import { test as base, mergeTests, request } from "@playwright/test";
import { test as apiHelpersFixture } from "../api/api-helpers-fixture.js";
import { test as pageObjectFixture } from "./page-object-fixture.js";

/**
 * Entry point for UI specs (anything using `page`, `cartPage`, etc.).
 *
 * apiRequest here (via apiHelpersFixture -> ui-api-request-fixture.ts)
 * is bound to context.request, so it shares cookies/session with `page`.
 *
 * For pure API specs (no page, no browser needed), import from
 * test-options.api.ts instead — that one uses the standalone `request`
 * fixture with no browser context overhead.
 */
const test = mergeTests(pageObjectFixture, apiHelpersFixture);

const expect = base.expect;

export { expect, request, test };
