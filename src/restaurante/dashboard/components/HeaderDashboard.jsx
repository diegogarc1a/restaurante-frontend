import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useVentaStore } from "../../../hooks";

export const HeaderDashboard = () => {

    const { getEstadisticas } = useVentaStore();

    const [stompClient, setStompClient] = useState(null);
    const [estadisticas, setEstadisticas] = useState([]);


    useEffect(() => {
        getEstadisticas().then(e => {
            setEstadisticas(e);
        })     
    }, [])
    

    useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_URL}ws`);
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
    console.log("Connected: " + frame);
    client.subscribe("/topic/dashboard", (message) => {
        // console.log("Message received: " + message.body);
        const resp = JSON.parse(message.body);
        setEstadisticas(resp);
   
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

  return (
      
      <div className="main">
    
        <h1 className="h1">Estadisticas del día</h1>


     
    <div className="box-container">
        
    <div className="box box5">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">${estadisticas[0].ingresosObtenidos.toFixed(2)}</h2>
            )}
                <h2 className="topic">Ingresos totales</h2>
            </div>

            <i className="pi pi-money-bill" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>


        <div className="box box1">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">{estadisticas[0].cantidadPedidosHoy}</h2>
            )}
                <h2 className="topic">Pedidos</h2>
            </div>
            
            <i className="pi pi-shopping-cart" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>

        <div className="box box2">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">{estadisticas[0].productosVendidos}</h2>
            )}
                
                <h2 className="topic">Productos vendidos</h2>
            </div>

            <i className="pi pi-send" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>

        <div className="box box3">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">{estadisticas[0].pedidosEnProceso}</h2>
            )}
                
                <h2 className="topic">Pedidos en proceso</h2>
            </div>

            <i className="pi pi-spinner" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>

        <div className="box box3">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">{estadisticas[0].pedidosPendientesDePago}</h2>
            )}
                
                <h2 className="topic">Pedidos en pendientes de pago</h2>
            </div>

            <i className="pi pi-clock" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>

        <div className="box box4">
            <div className="text">
            {estadisticas[0] && (
            <h2 className="topic-heading">{estadisticas[0].pedidosTerminados}</h2>
            )}
                
                <h2 className="topic">Pedidos terminados</h2>
            </div>

            <i className="pi pi-check-circle" style={{ color: 'white', fontSize: '2.5rem' }}></i>

        </div>
        
    </div>
    </div>
  )
}
