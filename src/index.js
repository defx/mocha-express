#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { testSuiteServer } from "./testSuiteServer.js";
import { socketServer } from "./socketServer.js";
import { getIstanbulCoverage } from "./getIstanbulCoverage.js";

import { createReport } from "./createReport.js";
import { loadPage } from "./loadPage.js";
import { watch } from "./watch.js";

const TEST_SUITE_URL = "http://localhost:5001";

const argv = yargs(hideBin(process.argv)).argv;

async function start() {
  let p = socketServer();
  testSuiteServer();

  if (argv.coverage) {
    const coverage = await getIstanbulCoverage(
      TEST_SUITE_URL,
      [`src/**/*.js`, `!*.test.js`, `!*.spec.js`],
      p
    );
    createReport(coverage);
  } else {
    loadPage(TEST_SUITE_URL);
  }

  if (argv.watch) {
    watch([`src/**/*.js`, `test/**/*.js`, `*.test.js`, `*.spec.js`], 80);
  } else {
    p.then((stats) => {
      process.exit(stats.failures === 0 ? 0 : 1);
    });
  }
}
start();
