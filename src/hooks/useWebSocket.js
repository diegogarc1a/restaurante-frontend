import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";

let socket;
let client;

export const connectWebSocket = () => {
  socket = new SockJS("http://localhost:8080/sba-websocket");
  client = Stomp.over(socket);

  client.connect({}, (frame) => {
    console.log("Connected: " + frame);
  }, (error) => {
    console.log("Error: " + error);
  });

  return client;
};

export const disconnectWebSocket = () => {
  if (client && client.connected) {
    client.disconnect(() => {
      console.log("Disconnected");
      socket.close();
    });
  }
};

export const useWebSocket = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const wsClient = connectWebSocket();
    setClient(wsClient);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const subscribe = (topic, callback) => {
    if (client && client.connected) {
      client.subscribe(topic, callback);
    }
  };

  return {client, subscribe};
};