#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { testSuiteServer } from "./testSuiteServer.js"
import { socketServer } from "./socketServer.js"
import { getIstanbulCoverage } from "./getIstanbulCoverage.js"

import { createReport } from "./createReport.js"

const TEST_SUITE_URL = "http://localhost:5001"

const argv = yargs(hideBin(process.argv)).argv

async function start() {
  let p = socketServer()
  testSuiteServer()
  const coverage = await getIstanbulCoverage(
    `http://localhost:5001`,
    `src/*.js`,
    p
  )
  createReport(coverage)
  p.then((stats) => {
    process.exit(stats.failures === 0 ? 0 : 1)
  })
}
start()
