#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"
import { getIstanbulCoverage } from "./getIstanbulCoverage.js"
import { loadPage } from "./loadPage.js"
import { createReport } from "./createReport.js"

const TEST_SUITE_URL = "http://localhost:5001"

const argv = yargs(hideBin(process.argv)).argv

async function start() {
  let end

  socketServer().then(async (stats) => {
    console.log(stats)

    const coverage = await getIstanbulCoverage(
      `http://localhost:5001`,
      `src/*.js`
    )
    end()
    createReport(coverage)
    process.exit(stats.failures === 0 ? 0 : 1)
  })
  testSuiteServer()
  end = await loadPage(TEST_SUITE_URL)
}
start()
