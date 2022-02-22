import { EventEmitter } from "events"
import Mocha from "mocha"
import Spec from "mocha/lib/reporters/spec.js"
import createStatsCollector from "mocha/lib/stats-collector.js"
import { WebSocketServer } from "ws"

const { EVENT_RUN_END } = Mocha.Runner.constants

const deserialize = (o) =>
  Object.entries(o).reduce((a, [k, v]) => {
    if (k.startsWith("$$")) {
      a[k.slice(2)] = () => v
    } else {
      a[k] = v
    }

    return a
  }, {})

export function socketServer(opts = {}) {
  return new Promise((resolve) => {
    const { port = 7777 } = opts
    const wss = new WebSocketServer({ port })
    const runner = new EventEmitter()

    createStatsCollector(runner)

    const spec = new Spec(runner)

    console.log(`Socket ready on port ${port}`)

    wss.on("connection", function connection(ws) {
      ws.on("message", function incoming(v) {
        let { name, args } = JSON.parse(v)

        runner.emit(name, ...args.map(deserialize))

        if (name === EVENT_RUN_END) {
          resolve(runner.stats)
        }
      })
    })
  })
}
