#!/usr/bin/env node

import path from "path"
import { globby } from "globby"
import v8toIstanbul from "v8-to-istanbul"
import { getCoverage } from "./getCoverage.js"
import libCoverage from "istanbul-lib-coverage"

/*

@TODO: include empty entries for uncovered files

*/

export async function getIstanbulCoverage(url, glob) {
  const coverage = await getCoverage(url)
  const files = await globby(glob)

  // filter only the files we actually want coverage for...

  const results = coverage.result
    .filter((result) => result.url.startsWith(url))
    .map((result) => {
      let URL = result.url.split(url)[1]

      if (URL.charAt(0) === "/") URL = URL.slice(1)

      return {
        ...result,
        url: URL,
      }
    })
    .filter((result) => result.url.length)
    .filter((result) => files.find((url) => url === result.url))

  console.log(results.map(({ url }) => url))

  const map = libCoverage.createCoverageMap()

  for (const result of results) {
    const { url, functions } = result

    const converter = v8toIstanbul(path.resolve(url), 0)
    await converter.load()

    converter.applyCoverage(functions)
    map.merge(converter.toIstanbul())
  }

  return map
}
