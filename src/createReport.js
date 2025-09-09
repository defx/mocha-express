import libReport from "istanbul-lib-report"
import reports from "istanbul-reports"

const watermarks = {
  statements: [50, 80],
  functions: [50, 80],
  branches: [50, 80],
  lines: [50, 80],
}

export const createReport = (
  coverageMap,
  type = "lcov",
  dir = "./coverage"
) => {
  const context = libReport.createContext({
    dir,
    watermarks,
    coverageMap,
  })

  const report = reports.create(type, {
    skipEmpty: false,
    skipFull: false,
  })

  report.execute(context)
}
