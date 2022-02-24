import chokidar from "chokidar"
import { WebSocketServer } from "ws"

export function watch(files, port = 80) {
  const wss = new WebSocketServer({ port })
  wss.on("connection", (socket) => {
    chokidar.watch(files).on("change", () => {
      socket.send("reload")
    })
    //@todo: handle unlink, add
  })
}
