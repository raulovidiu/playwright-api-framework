# Playwright Framework for API Testing

End-to-end automated test suite for the [E-commerce](../app/README.md) demo application, built with **Playwright** and **TypeScript**.

---

## Tech Stack

- [Playwright](https://playwright.dev/) `^1.60.0` – E2E testing framework
- [TypeScript](https://www.typescriptlang.org/) `6.0.3`
- [Zod](https://zod.dev/) `4.4.3` – data validation / schema parsing
- [@faker-js/faker](https://fakerjs.dev/) `10.4.0` – test data generation
- [Biome](https://biomejs.dev/) `^2.4.16` – linting and code formatting
- [dotenv](https://github.com/motdotla/dotenv) – environment variable management

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

Environment variable files are located in the `./env/` directory:

| File | Environment |
|---|---|
| `env/.env.dev` | Development (default) |
| `env/.env.<ENVIRONMENT>` | Any other environment |

The `ENVIRONMENT` system variable controls which `.env` file is loaded. If not set, `.env.dev` is used by default.

**Demo credentials for the application:**

| Field | Value |
|---|---|
| Email | `demo@techmart.com` |
| Password | `demo123` |

---

## Running Tests

```bash
# Run all tests (headless)
npm test

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
├── env/                # Per-environment .env files
│   └── .env.dev
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
| Base URL | `http://localhost:3000` |
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

The REST API runs at `http://localhost:3000/api`. Full details in the [application README](../app/README.md).