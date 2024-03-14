import { useEffect } from "react";
import { useWebSocket } from "../../../hooks"
import { WebSocket } from "../../venta/components/WebSocket";

export const PedidoPage = () => {

    const {client, subscribe} = useWebSocket();

    useEffect(() => {
      if( client ){
        subscribe("/topic/ventas", (message) => {
            console.log("Mensaje recibido: " + message.body);
        })
      }
    }, [client])
    

  return (
    <>
    <div>PedidoPage</div>
    </>
  )
}
