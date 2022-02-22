#!/usr/bin/env node

import puppeteer from "puppeteer-core"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"
import { getIstanbulCoverage } from "./getIstanbulCoverage.js"

const TEST_SUITE_URL = "http://localhost:5001"

const argv = yargs(hideBin(process.argv)).argv

async function start() {
  puppeteer
    .launch({
      channel: "chrome",
    })
    .then((browser) => {
      console.log("Browser ready")
      socketServer().then(async (stats) => {
        const coverage = await getIstanbulCoverage(
          `http://localhost:5001`,
          `src/*.js`
        )
        console.log(coverage)
        // browser.close().then(() => process.exit(stats.failures === 0 ? 0 : 1))
      })
      testSuiteServer()
      return browser.newPage()
    })
    .then(async (page) => {
      page.goto(TEST_SUITE_URL)
    })
}
start()
