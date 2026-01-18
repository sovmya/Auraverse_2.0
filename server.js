const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });

// In-memory stores (OK for hackathon)
const devices = new Map();        // deviceId -> ws
const pairs = new Map();          // deviceId -> Set(deviceId)

console.log("Signaling server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  let deviceId = null;

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch {
      return;
    }

    switch (data.type) {

      // 1. Device registration
      case "register":
        deviceId = data.deviceId || uuidv4();
        devices.set(deviceId, ws);
        pairs.set(deviceId, pairs.get(deviceId) || new Set());

        ws.send(JSON.stringify({
          type: "registered",
          deviceId
        }));
        break;

      // 2. Pairing request
      case "pair":
        const target = data.targetDeviceId;
        if (devices.has(target)) {
          pairs.get(deviceId).add(target);
          pairs.get(target).add(deviceId);

          devices.get(target).send(JSON.stringify({
            type: "paired",
            deviceId
          }));

          ws.send(JSON.stringify({
            type: "paired",
            deviceId: target
          }));
        }
        break;

      // 3. WebRTC signaling relay
      case "signal":
        if (!pairs.get(deviceId)?.has(data.to)) return;

        const peer = devices.get(data.to);
        if (peer) {
          peer.send(JSON.stringify({
            type: "signal",
            from: deviceId,
            payload: data.payload
          }));
        }
        break;

      // 4. Clipboard sync request (NO DATA)
      case "clipboard-request":
        if (!pairs.get(deviceId)?.has(data.to)) return;

        const peerDevice = devices.get(data.to);
        if (peerDevice) {
          peerDevice.send(JSON.stringify({
            type: "clipboard-request",
            from: deviceId
          }));
        }
        break;
    }
  });

  ws.on("close", () => {
    if (deviceId) {
      devices.delete(deviceId);
      pairs.delete(deviceId);
    }
  });
});