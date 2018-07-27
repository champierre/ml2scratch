var WebSocketServer = require('ws').Server;
const PORT = 8080;
var wss = new WebSocketServer({port: PORT});
var connections = [];

console.log("Starting ml2scratch 0.0.1...");
console.log("");
console.log("Ctrl+C to stop");
console.log("");
console.log("Setup");
console.log("1. Open http://localhost:8081/demo.html");
console.log("2. Open http://scratchx.org/?url=http://localhost:8081/ml2scratch_local.js");
console.log("");

wss.on('connection', function(ws, req) {
  if (req.url == '/ml') {
    console.log('Machine Learning client is connected.');
  } else if (req.url == '/scratchx') {
    console.log('ScratchX extension is connected.');
  }
  connections.push(ws);

  ws.on('close', function() {
    connections = connections.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
  });
  ws.on('message', function(json) {
    console.log("received " + json);
    data = JSON.parse(json);
    if (data.action == 'predict') {
      if (connections) {
        connections.forEach(function (conn, i) {
          conn.send(JSON.stringify({action: 'predict', value: data.value}));
        });
      }
    }
  });
});
