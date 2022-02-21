#!/usr/bin/env node

import path from "path"
import fs from "fs"
import puppeteer from "puppeteer-core"
import pti from "puppeteer-to-istanbul"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"

const TEST_SUITE_URL = "http://localhost:5001"

const argv = yargs(hideBin(process.argv)).argv

async function start() {
  let page

  puppeteer
    .launch({
      channel: "chrome",
    })
    .then((browser) => {
      console.log("Browser ready")
      socketServer().then(async (stats) => {
        const [jsCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          // page.coverage.stopCSSCoverage(),
        ])

        pti.write([...jsCoverage], {
          includeHostname: false,
          storagePath: "./.nyc_output",
        })

        /*
        
        @todo: find a better way
        
        */

        let o = await fs.promises
          .readFile(path.resolve("./.nyc_output/out.json"), "utf8")
          .then(JSON.parse)

        let x = {}

        for (const k in o) {
          x[k.replace(`.nyc_output/`, "")] = {
            ...o[k],
            path: o[k].path.replace(`.nyc_output/`, ""),
          }
        }

        fs.writeFileSync(
          path.resolve("./.nyc_output/out.json"),
          JSON.stringify(x, null, 2),
          "utf8"
        )

        browser.close().then(() => process.exit(stats.failures === 0 ? 0 : 1))
      })
      testSuiteServer()
      return browser.newPage()
    })
    .then(async (p) => {
      page = p
      await Promise.all([
        page.coverage.startJSCoverage({
          // resetOnNavigation: false,
        }),
        // page.coverage.startCSSCoverage(),
      ])
      page.goto(TEST_SUITE_URL)
    })
}
start()
