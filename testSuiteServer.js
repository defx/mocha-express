import express from "express"
import { globby } from "globby"

let tpl = (tests) => {
  const scripts = tests
    .map((src) => `<script type="module" src="${src}"></script>`)
    .join("\n")

  return /* HTML */ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Mocha Tests</title>
        <link rel="stylesheet" href="https://unpkg.com/mocha/mocha.css" />
      </head>
      <body>
        <div id="mocha"></div>
        <div id="container"></div>
        <script src="https://unpkg.com/chai/chai.js"></script>
        <script src="https://unpkg.com/mocha/mocha.js"></script>

        <script type="module">
          import { wsReporter } from "https://unpkg.com/mocha-ws-reporter@0.1.3"

          mocha.setup({
            ui: "bdd",
            reporter: wsReporter({ port: 7777 }),
          })
        </script>
        ${scripts}
        <script>
          new WebSocket("ws://localhost:80").addEventListener(
            "message",
            (event) => {
              if (event.data === "reload") window.location.reload()
            }
          )
        </script>
      </body>
    </html>
  `
}

async function init(app) {
  // @todo: make this configurable
  const testSuiteHTML = await globby(["test/**/*.js"])
    .then((files) => {
      files.sort((a, b) => {
        if (b === "test/setup.js") return 1
        if (a === "test/setup.js") return -1
        return 0
      })
      return files
    })
    .then((files) => tpl(files))

  app.use(express.static("./"))

  app.get("/", (_, res) => {
    res.send(testSuiteHTML)
  })
}

export function testSuiteServer() {
  const app = express()
  const PORT = 5001

  app.listen(PORT, () => {
    init(app)
    console.log(`Test suite ready on port ${PORT}`)
  })
}
