require 'em-websocket'
require 'pp'

connnections = []

EM::WebSocket.start({:host => "0.0.0.0", :port => 8080}) do |ws_conn|
  ws_conn.onopen do
    connnections << ws_conn
  end

  ws_conn.onmessage do |message|
    pp message
    connnections.each{|conn| conn.send(message) }
  end
end
