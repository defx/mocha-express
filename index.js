#!/usr/bin/env node

import puppeteer from "puppeteer-core"
import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"

const TEST_SUITE_URL = "http://localhost:5001"

async function start() {
  puppeteer
    .launch({
      channel: "chrome",
    })
    .then((browser) => {
      console.log("Browser ready")
      socketServer().then((stats) => {
        browser.close().then(() => process.exit(stats.failures === 0 ? 0 : 1))
      })
      testSuiteServer()
      return browser.newPage()
    })
    .then((page) => page.goto(TEST_SUITE_URL))
}
start()
