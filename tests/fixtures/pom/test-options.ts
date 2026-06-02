import { test as base, mergeTests, request } from "@playwright/test";
import { test as apiRequestFixture } from "../api/api-request-fixture.js";
import { test as pageObjectFixture } from "./page-object-fixture.js";

const test = mergeTests(pageObjectFixture, apiRequestFixture);

const expect = base.expect;

export { expect, request, test };
