# mocha-express

Browser-based JavaScript testing with Mocha over HTTP that runs on any browser and/or device.

**Key Features:**

- Built on **Mocha** and **Chai** for familiar syntax and behavior.
- Fast CI/CLI test execution via Chrome DevTools Protocol (CDP).
- **Watch mode** for instant feedback during development.
- **Code coverage** via **Istanbul**.

---

## Installation

Install as a dev dependency:

```bash
npm install --save-dev mocha-express
```

---

## Running Tests

Run all of your tests once in Chrome...

```bash
mocha-express
```

---

## Watch Mode

For fast feedback during development, enable watch mode to re-run tests whenever your code changes...

```bash
mocha-express --watch
```

---

## Code Coverage

Generate coverage reports using Istanbul:

```bash
mocha-express --coverage
```

Reports are saved in the `coverage/` directory, ready for CI integration or local inspection.
