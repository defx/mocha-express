import chromeLauncher from "chrome-launcher"
import CDP from "chrome-remote-interface"

const launchChrome = () =>
  chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", "--headless"],
  })

export function loadPage(url) {
  return launchChrome()
    .then(async (chrome) => {
      const protocol = await CDP({ port: chrome.port })
      try {
        const { Page } = protocol
        await Page.enable()
        Page.navigate({ url })
        await Page.loadEventFired()
        return
      } catch (err) {
        console.error(err)
      } finally {
        protocol.close()
        chrome.kill()
      }
    })
    .catch((err) => console.error(err))
}
