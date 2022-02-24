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
        <script>
          const identityTpl = (strings, ...values) =>
            strings.reduce((a, v, i) => a + v + (values[i] || ""), "")

          const mount = (v) => {
            let node = document.getElementById("container")
            node.innerHTML = ""

            if (typeof v === "string") node.innerHTML = v
            if (v.nodeName) node.appendChild(v)
            return node.firstChild
          }

          const nextFrame = () =>
            new Promise((resolve) => requestAnimationFrame(resolve))

          window.mount = mount
          window.html = identityTpl
          window.css = identityTpl
          window.nextFrame = nextFrame
          window.assert = chai.assert
          window.$ = (v) => document.querySelector("#container " + v)
          window.$$ = (v) =>
            Array.from(document.querySelectorAll("#container " + v))

          let count = 0

          window.createName = () => "x-" + count++
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
  const testSuiteHTML = await globby(["test/**/*.js"]).then((files) =>
    tpl(files)
  )

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
