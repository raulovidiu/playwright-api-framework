import { test as base, mergeTests, request } from "@playwright/test";
import { test as apiHelpersFixture } from "../api/api-helpers-fixture.js";
import { test as pageObjectFixture } from "./page-object-fixture.js";

const test = mergeTests(pageObjectFixture, apiHelpersFixture);

const expect = base.expect;

export { expect, request, test };
