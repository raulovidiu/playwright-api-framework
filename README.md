# Playwright Framework for API Testing

End-to-end automated test suite for the [E-commerce](../app/README.md) demo application, built with **Playwright** and **TypeScript**.

---

## Tech Stack

- [Playwright](https://playwright.dev/) `^1.61.1` – E2E testing framework
- [TypeScript](https://www.typescriptlang.org/) `7.0.2`
- [Zod](https://zod.dev/) `4.4.3` – data validation / schema parsing
- [@faker-js/faker](https://fakerjs.dev/) `10.5.0` – test data generation
- [Biome](https://biomejs.dev/) `^2.5.4` – linting and code formatting
- [dotenv](https://github.com/motdotla/dotenv) `17.4.2` – environment variable management
- [cross-env](https://github.com/75lb/cross-env) `10.1.0` – cross-platform environment variables

---

## Prerequisites

- Node.js (recommended: LTS version)
- The TechMart application must be available (or it will be started automatically – see Configuration)

---

## Installation

```bash
npm install
npx playwright install
```

---

## Environment Configuration

Environment variables are managed using `dotenv`. To configure your local environment, create a `.env.local` file in the root directory with the following variables:

```env
BASE_URL=http://localhost:3000
USER_EMAIL=demo@techmart.com
USER_PASSWORD=demo123
```

| Variable | Description | Default / Demo Value |
|---|---|---|
| `BASE_URL` | The URL where the application under test is running | `http://localhost:3000` |
| `USER_EMAIL` | Demo user authentication email | `demo@techmart.com` |
| `USER_PASSWORD` | Demo user authentication password | `demo123` |

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run API layer tests only
npm run test:api

# Run E2E tests only
npm run test:e2e

# Run with a visible browser
npm run test:headed

# Open the Playwright interactive UI
npm run test:ui

# View the HTML report after a run
npm run test:report
```

---

## Project Structure

```
.
├── tests/              # Test files
│   ├── api-layer/      # API framework tests
│   └── e2e/            # End-to-end user flows
├── .env.local          # Local environment variables (do not commit)
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Playwright Configuration

Key settings from `playwright.config.ts`:

| Parameter | Value |
|---|---|
| Test directory | `./tests` |
| Parallel execution | Yes (`fullyParallel: true`) |
| Workers | 4 |
| Browser | Firefox (Desktop) |
| Base URL | Configured via `BASE_URL` |
| Retries (CI) | 2 |
| Screenshot | On failure |
| Video | On first retry |
| Trace | On first retry |

The application is started automatically before the tests via `webServer`. If a local server is already running, it will be reused (outside of CI environments).

---

## Linting & Formatting

```bash
# Check code
npm run lint

# Auto-fix issues
npm run fix

# Format code
npm run format
```

---

## Reports

Playwright automatically generates an **HTML report** and a **list report** after each run. To view it:

```bash
npm run test:report
```

---

## Application Under Test

The E-commerce application exposes the following features covered by the test suite:

- Product listing and filtering
- Shopping cart management
- User authentication and registration
- Checkout process
- Orders management

The REST API runs at `http://localhost:3000/api`. Full details in the [application README](../app/README.md).