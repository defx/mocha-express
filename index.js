#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"
import { getIstanbulCoverage } from "./getIstanbulCoverage.js"
import { loadPage } from "loadPage.js"

const TEST_SUITE_URL = "http://localhost:5001"

const argv = yargs(hideBin(process.argv)).argv

async function start() {
  socketServer().then(async (stats) => {
    const coverage = await getIstanbulCoverage(`http://localhost:5001`)
    console.log(coverage)
    // browser.close().then(() => process.exit(stats.failures === 0 ? 0 : 1))
  })
  testSuiteServer()
  loadPage(TEST_SUITE_URL)
}
start()
