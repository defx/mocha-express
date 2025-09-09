import chromeLauncher from "chrome-launcher"
import CDP from "chrome-remote-interface"

const launchChrome = () =>
  chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", "--headless"],
  })

export function getCoverage(url, testSuiteComplete) {
  return launchChrome()
    .then(async (chrome) => {
      const protocol = await CDP({ port: chrome.port })
      try {
        const { Page, Profiler } = protocol
        await Profiler.enable()
        await Page.enable()
        await Profiler.startPreciseCoverage()

        Page.navigate({ url })
        await testSuiteComplete

        const res = await Profiler.takePreciseCoverage()
        await Profiler.stopPreciseCoverage()

        return res
      } catch (err) {
        console.error(err)
      } finally {
        protocol.close()
        chrome.kill()
      }
    })
    .catch((err) => console.error(err))
}
