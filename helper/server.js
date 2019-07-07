// server.js on glitch

const WebSocketServer = require("uws").Server
const wss = new WebSocketServer({port: process.env.PORT})
var connections = {};

wss.on('connection', (ws) => {
  ws.on('close', function() {
    Object.keys(connections).forEach(function (key) {
      if (connections[key] === ws) {
        delete connections[key];
      }
    });
  });
  ws.on('message', function(json) {

    var data = JSON.parse(json);
    if (data.action == 'connect') {
      if (!connections[data.conn_id]) {
        connections[data.conn_id] = [];
      }
      connections[data.conn_id].push(ws);
    } else if (data.action == 'predict') {
      if (data.conn_id) {
        var conns = connections[data.conn_id];
        if (conns && conns.length > 0) {
          for(let i = 0; i < conns.length; i++) {
            if (conns[i]) {
              conns[i].send(JSON.stringify({action: 'predict', value: data.value, label: data.label}));
            }
          }
        }
      }
    }
  });
});

wss.on('error', (error) => {
  throw error
})
