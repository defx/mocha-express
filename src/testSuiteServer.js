import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import express from "express";
import { globby } from "globby";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tpl = (tests) => {
  const scripts = tests
    .map((src) => {
      const jsFile = src.replace(/\.ts$/, ".ts.js");
      return `<script type="module" src="./${jsFile}"></script>`;
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
          import { wsReporter } from "/mocha-ws-reporter.js";
          import { expect } from "/chai.js";

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
    "test/**/*.{js,ts}",
    "spec/**/*.{js,ts}",
    "**/*test.{js,ts}",
    "**/*spec.{js,ts}",
    "!node_modules",
  ]);

  const testSuiteHTML = tpl(testFiles);

  app.get("/mocha.js", (req, res) => {
    const filePath = path.join(
      __dirname,
      "../node_modules",
      "mocha",
      "mocha.js"
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  });

  app.get("/mocha-ws-reporter.js", (req, res) => {
    const filePath = path.join(
      __dirname,
      "../node_modules",
      "mocha-ws-reporter",
      "index.js"
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  });

  app.get("/chai.js", (req, res) => {
    const filePath = path.join(
      __dirname,
      "../node_modules",
      "chai",
      "index.js"
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  });

  app.get("/mocha.css", (req, res) => {
    const filePath = path.join(
      __dirname,
      "../node_modules",
      "mocha",
      "mocha.css"
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  });

  app.use(async (req, res, next) => {
    let requested = req.path.replace(/^\//, "");

    if (!requested.endsWith(".js")) {
      return next();
    }

    const file = await fs.promises.readFile(
      requested.endsWith(".ts.js")
        ? requested.replace(/\.ts\.js$/, ".ts")
        : requested,
      "utf8"
    );

    let { code } = await esbuild.transform(file, {
      format: "esm",
      sourcemap: "inline",
    });

    res.type("application/javascript");
    return res.send(code);
  });

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
