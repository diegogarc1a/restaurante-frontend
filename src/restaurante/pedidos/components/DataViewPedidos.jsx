import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { format, parseISO  } from "date-fns";
import { es } from 'date-fns/locale';
import { useVentaStore } from "../../../hooks";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";


export const DataViewPedidos = () => {
    const [visible, setVisible] = useState(false);
    const { ventas, addVentaWS, updateVentaWS, pedidoFinalizado } = useVentaStore();
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [selectedState, setSelectedState] = useState('Proceso');
    const [selectedDetalle, setSelectedDetalle] = useState(null);

    const states = [
        { label: 'Proceso', value: 'Proceso' },
        { label: 'Terminado', value: 'Terminado' },
      ];
    
        const [stompClient, setStompClient] = useState(null);
        useEffect(() => {
        const socket = new SockJS("http://localhost:8080/sba-websocket");
        const client = Stomp.over(socket);
    
        client.connect({}, (frame) => {
        console.log("Connected: " + frame);
        // client.subscribe("/topic/ventas", (message) => {
        client.subscribe("/topic/ventas", (message) => {
            console.log("Message received: " + message.body);
            addVentaWS(JSON.parse(message.body));
        });
        client.subscribe("/topic/editventas", (message) => {
            console.log("Message received: " + message.body);
            updateVentaWS(JSON.parse(message.body));
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
        

    const onFilterVentas = (state) => {
        setSelectedState(state.value);
      };
      
      const filterVentas = (ventas) => {
        if (selectedState === 'Todos') {
          return ventas;
        }
        return ventas.filter((venta) => venta.estado === selectedState);
      };

    
      const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      };

    const onSelectPedido = (pedido) => {
        return () => {
        setVisible(true);
        setPedidoDetalle(pedido);
        };
      };


    const gridItem = (pedido, index) => {
        return (
            <div className="sm:col-12 col-12 p-1" key={pedido.id}>
                <div className={classNames("p-4 border-1 border-round", { 'bg-teal-100 text-teal-900' : index === 0 && pedido.estado === 'Proceso'})}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user"></i>
                            <span className="font-semibold">{pedido.nombrecliente}</span>
                        </div>
                            <span className="font-semibold">{format(parseISO(pedido.fecha.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6')), 'cccc, dd MMMM y, h:mm:ss a', { locale: es })}</span>
                            <Tag severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <DataTable value={pedido.listaDetalleVenta}
                        selectionMode="checkbox"
                        selection={selectedDetalle} onSelectionChange={(e) => setSelectedDetalle(e.value)} 
                        size="small" 
                        className="col-12 p-1" 
                        stripedRows showGridlines  
                        tableStyle={{ minWidth: '20rem' }}>
                            {
                            pedido.estado === "Proceso" 
                            ? <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            : ''
                            }
                            <Column align={"center"} field="cantidad" header="Cantidad"></Column>
                            <Column field="producto.nombre" header="Producto"></Column>
                            <Column field="descripcion" header="Descripcion"></Column>
                        </DataTable>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-lg font-semibold">Total a pagar: {formatCurrency(pedido.preciototal)}
                        </span>
                        {
                            (pedido.estado === "Proceso") 
                            ? <Button icon="pi pi-check-circle" severity="success" size="large"
                            className="p-button-rounded" onClick={onSelectPedido(pedido)}></Button>
                            : ''
                        }
                        
                    </div>
                </div>
            </div>
        );
    };

   
    const listTemplate = (pedidos) => {
        return <div className="grid grid-nogutter flex flex-wrap justify-content-center">{pedidos.map((pedido, index) => gridItem(pedido, index))}</div>;
    };

    const header = () => {
        return (
        <div>
            <Dropdown value={selectedState} options={states} optionLabel="label" onChange={onFilterVentas} placeholder="Seleccione estado" className="w-full md:w-14rem" />
            <div className="flex justify-content-end m-2">

                <div className="ml-2">
                </div>
            </div>
        </div>
        );
    };

    //ConfirmDialog options
    const acceptDialog = () => {
        pedidoFinalizado(pedidoDetalle);
    }

    const rejectDialog = () => {
        console.log("Rechazado")
    }

    return (
        <div className="grid flex justify-content-center flex-wrap">
            <div className="col-12">
            <DataView value={filterVentas(ventas)} listTemplate={listTemplate} header={header()} paginator rows={5}/>

            <ConfirmDialog group="declarative" visible={visible} 
                onHide={() => setVisible(false)} 
                message="Estas seguro de marcar el pedido como Finalizado?" 
                header="Confirmacion" acceptLabel="Sí" 
                rejectLabel="No" icon="pi pi-exclamation-triangle" 
                accept={acceptDialog} reject={rejectDialog} 
                draggable={false}
            />
            </div>
        </div>
    )
}
        