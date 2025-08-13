# mocha-express

**The lightweight, in-browser test runner built on Mocha for JavaScript that interacts with real browser environments.**

Run your tests via a local HTML server, with any browser of your choice and any assertion library, and get fast feedback on **UI behavior, DOM APIs, and browser-driven logic**. Perfect for developers who want reliable, CI-ready browser testing without heavy frameworks.

**Key Features:**

- Built on **Mocha** for familiar syntax and behavior.
- Fast test execution via Chrome DevTools Protocol (CDP).
- Works with **any assertion library** (e.g., Chai).
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

Run tests in Chrome headlessly or open any browser to connect to the local server:

```bash
# Open any browser to view tests
mocha-express
```

---

## Using with Chai

`mocha-express` uses Mocha for test structure and works with any assertion library. Here’s a simple example with Chai:

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

---

## Watch Mode

For fast feedback during development, enable watch mode:

```bash
mocha-express --watch
```

Tests automatically reload when your source files change.

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
mocha-express --headless --coverage
```

---

## Bring your own browser

Because mocha-express runs as a standard HTML server, you can easily deploy it wherever you need it and connect from any device or browser.

## Contributing

PRs and suggestions welcome! The focus is on **browser-driven JavaScript testing**: lightweight, reliable, and flexible.
