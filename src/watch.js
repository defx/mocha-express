import chokidar from "chokidar";
import { WebSocketServer } from "ws";

export function watch(files, port = 80) {
  const wss = new WebSocketServer({ port });
  let ws;

  chokidar.watch(files).on("change", () => {
    ws?.send("reload");
  });

  wss.on("connection", (socket) => {
    ws = socket;
  });
}
