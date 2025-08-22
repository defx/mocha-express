# mocha-express

Lightweight browser-based testing using Mocha. Runs your tests in headless Chrome by default so that you can execute from the CLI and CI/CD. Exposes your tests via a HTTP server so that you can serve your tests and connect from any device/browser.

**Key Features:**

- Built on **Mocha** for familiar syntax and behavior.
- Fast CI/CLI test execution via Chrome DevTools Protocol (CDP).
- Works with **any browser-compatible assertion library** (e.g., Chai).
- **Watch mode** for instant feedback during development.
- **Code coverage** via **Istanbul**.
- **CI-ready** with proper exit codes.

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

For fast feedback during development, enable watch mode to re-run tests whenever the code changes...

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

---

## CI Integration

`mocha-express` provides proper exit codes and coverage reporting, making it simple to integrate into CI pipelines:

```bash
mocha-express --coverage
```

---

## Using with Chai

`mocha-express` uses Mocha for test structure and works with any assertion library that runs in the browser. Here’s a simple example with Chai:

```js
import { expect } from "chai";

describe("DOM Example", () => {
  it("creates and appends an element", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    expect(document.body.contains(el)).to.be.true;
  });

  it("updates text content", () => {
    const el = document.createElement("p");
    el.textContent = "Hello World";
    document.body.appendChild(el);
    expect(el.textContent).to.equal("Hello World");
  });
});
```
