const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let state = { time: 0, playing: false };

wss.on("connection", (ws) => {
    console.log("新用户连接");
    ws.send(JSON.stringify(state));

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        state = { time: data.time, playing: data.playing };

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(state));
            }
        });
    });

    ws.on("close", () => console.log("用户断开连接"));
});

server.listen(3000, () => console.log("WebSocket 服务器运行在端口 3000"));
