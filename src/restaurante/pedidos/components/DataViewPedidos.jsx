import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useVentaStore } from "../../../hooks";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
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
    const [layout, setLayout] = useState('grid');
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [selectedState, setSelectedState] = useState('Proceso');

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



    const onSelectPedido = (pedido) => {
        return () => {
        setVisible(true);
        setPedidoDetalle(pedido);
        };
      };
    

    const listItem = (pedido, index) => {
        return (
            <div className="col-12" key={pedido.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{pedido.nombrecliente}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex align-items-center">
                            <DataTable value={pedido.listaDetalleVenta} 
                        size="small" 
                        className="col-12 p-1" 
                        stripedRows showGridlines  
                        tableStyle={{ minWidth: '35rem' }}>
                            <Column align={"center"} field="cantidad" header="Cantidad"></Column>
                            <Column field="producto.nombre" header="Producto"></Column>
                            <Column field="descripcion" header="Descripcion"></Column>
                        </DataTable>
                            </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">${pedido.preciototal}</span>
                            <Button icon="pi pi-list" className="p-button-rounded"></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (pedido, index) => {
        return (
            <div className="sm:col-6 col-12 p-1" key={pedido.id}>
                <div className={classNames("p-4 border-1 border-round", { 'bg-teal-100 text-teal-900' : index === 0})}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user"></i>
                            <span className="font-semibold">{pedido.nombrecliente}</span>
                        </div>
                            <Tag severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <DataTable value={pedido.listaDetalleVenta} 
                        size="small" 
                        className="col-12 p-1" 
                        stripedRows showGridlines  
                        tableStyle={{ minWidth: '20rem' }}>
                            <Column align={"center"} field="cantidad" header="Cantidad"></Column>
                            <Column field="producto.nombre" header="Producto"></Column>
                            <Column field="descripcion" header="Descripcion"></Column>
                        </DataTable>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-lg font-semibold">${pedido.preciototal}</span>
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

    const itemTemplate = (pedido, layout, index) => {
        if (!pedido) {
            return;
        }

        if (layout === 'list') return listItem(pedido, index);
        else if (layout === 'grid') return gridItem(pedido, index);
    };

    const listTemplate = (pedidos, layout) => {
        return <div className="grid grid-nogutter flex flex-wrap justify-content-center">{pedidos.map((pedido, index) => itemTemplate(pedido, layout, index))}</div>;
    };

    const header = () => {
        return (
        <div>
            <Dropdown value={selectedState} options={states} optionLabel="label" onChange={onFilterVentas} placeholder="Seleccione estado" className="w-full md:w-14rem" />
            <div className="flex justify-content-end m-2">
                <div>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
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
            <DataView value={filterVentas(ventas)} listTemplate={listTemplate} layout={layout} header={header()}/>

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
        