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

      const end = () => {
        protocol.close()
        chrome.kill()
      }

      try {
        const { Page } = protocol
        await Page.enable()
        Page.navigate({ url })
        await Page.loadEventFired()
        return end
      } catch (err) {
        console.error(err)
        end()
      }
    })
    .catch((err) => console.error(err))
}
