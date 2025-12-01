import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { globby } from "globby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tpl = (tests) => {
  const scripts = tests
    .map((src) => {
      return `<script type="module" src="./${src}"></script>`;
    })
    .join("\n");

  return /* HTML */ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Mocha Tests</title>
        <link rel="stylesheet" href="mocha.css" />
      </head>
      <body>
        <div id="mocha"></div>
        <div id="container"></div>
        <script src="mocha.js"></script>
        <script type="module">
          import { expect } from "/chai.js";
          import { wsReporter } from "/mocha-ws-reporter.js";

          window.expect = expect;

          mocha.setup({
            ui: "bdd",
            reporter: wsReporter({ port: 7777 }),
          });
        </script>
        ${scripts}
        <script>
          new WebSocket("ws://localhost:80").addEventListener(
            "message",
            (event) => {
              if (event.data === "reload") window.location.reload();
            }
          );
        </script>
      </body>
    </html>
  `;
};

async function init(app) {
  const testFiles = await globby([
    "test/**/*.js",
    "spec/**/*.js",
    "**/*test.js",
    "**/*spec.js",
    "!node_modules",
  ]);

  const testSuiteHTML = tpl(testFiles);

  app.get("/mocha.js", (req, res) => {
    // Use import.meta.resolve to find the actual installed location of mocha
    try {
      const mochaPath = import.meta.resolve("mocha/mocha.js");
      const filePath = fileURLToPath(mochaPath);
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(404).send("File not found");
        }
      });
    } catch (error) {
      res.status(404).send("mocha.js not found");
    }
  });

  app.get("/mocha-ws-reporter.js", (req, res) => {
    try {
      const reporterPath = import.meta.resolve("mocha-ws-reporter");
      const filePath = fileURLToPath(reporterPath);
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(404).send("File not found");
        }
      });
    } catch (error) {
      res.status(404).send("mocha-ws-reporter.js not found");
    }
  });

  app.get("/chai.js", (req, res) => {
    try {
      const chaiPath = import.meta.resolve("chai");
      const filePath = fileURLToPath(chaiPath);
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(404).send("File not found");
        }
      });
    } catch (error) {
      res.status(404).send("chai.js not found");
    }
  });

  app.get("/mocha.css", (req, res) => {
    try {
      const mochaPath = import.meta.resolve("mocha/mocha.css");
      const filePath = fileURLToPath(mochaPath);
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(404).send("File not found");
        }
      });
    } catch (error) {
      res.status(404).send("mocha.css not found");
    }
  });

  app.use(express.static(process.cwd()));

  app.get("/", (_, res) => {
    res.send(testSuiteHTML);
  });
}

export function testSuiteServer() {
  const app = express();
  const PORT = 5001;

  app.listen(PORT, () => {
    init(app);
    console.log(`Test suite ready on port ${PORT}`);
  });
}
