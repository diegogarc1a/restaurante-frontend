import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";


export const WebSocket = () => {
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/sba-websocket");
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log("Connected: " + frame);
      // client.subscribe("/topic/ventas", (message) => {
      client.subscribe("/topic/ventas", (message) => {
        console.log("Message received: " + message.body);
      });
    }, (error) => {
      console.log("Error: " + error);
    });


    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);
  return <div>Ventas</div>;
};
