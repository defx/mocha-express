#!/usr/bin/env node

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
          includeHostname: true,
          storagePath: "./.nyc_output",
        })

        browser.close().then(() => process.exit(stats.failures === 0 ? 0 : 1))
      })
      testSuiteServer()
      return browser.newPage()
    })
    .then(async (p) => {
      page = p
      await Promise.all([
        page.coverage.startJSCoverage(),
        // page.coverage.startCSSCoverage(),
      ])
      page.goto(TEST_SUITE_URL)
    })
}
start()
