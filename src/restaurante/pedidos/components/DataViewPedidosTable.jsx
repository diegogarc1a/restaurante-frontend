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
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";


export const DataViewPedidosTable = () => {
    const [visible, setVisible] = useState(false);
    const { ventas, addVentaWS, updateVentaWS, pedidoFinalizado, filterVenta, startLoadingVentas } = useVentaStore();
    const [layout, setLayout] = useState('grid');
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("Proceso");
    const [selectedState, setSelectedState] = useState({ estado: 'Proceso' });

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

    // const onSelectProduct = (product) => () =>  {
    //     setProductDetalle(product);
    //     openVentaModal();
    // };


    //No sale rentable...
    const onFilterVentas = (param) => async() => {
        await startLoadingVentas();
        filterVenta(param);
    }

    const states = [
        { estado: 'Todos',},
        { estado: 'Proceso',},
        { estado: 'Terminado'},

    ];

    const onChangeState = ({target}) => {
        if(target.value.estado !== 'Todos') {
            setGlobalFilter(target.value.estado);
        }else{
            setGlobalFilter(null);
        }
        setSelectedState(target.value);
    }

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Pedidos</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                {/* <InputText type="search" onInput={onChangeState} placeholder="Search..." /> */}
                <Dropdown type="search" value={selectedState} onChange={onChangeState} options={states} optionLabel="estado"
                placeholder="Seleccione estado" className="w-full md:w-14rem" />
            </span>
        </div>
    );



    //ConfirmDialog options
    const acceptDialog = () => {
        pedidoFinalizado(pedidoDetalle);
    }

    const rejectDialog = () => {
        console.log("Rechazado")
    }

    const severity = (pedido) => {
        return (
            <Tag style={{ mb : 10 }} severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag>
        )
    }

    const onSelectPedido = (pedido) => {
        return () => {
        setVisible(true);
        setPedidoDetalle(pedido);
        };
      };

    const buttonPedidoFinalizado = (pedido) => {
        return (
            <div className="flex align-items-center justify-content-between">
                {
                    (pedido.estado === "Proceso") 
                    ? <Button icon="pi pi-check-circle" severity="success" size="large"
                    className="p-button-rounded" onClick={onSelectPedido(pedido)}></Button>
                    : ''
                }          
            </div>
        )
    }


    const itemPedido = (pedido) => {
        return (
        <div>
        {/* <Tag style={{ mb : 10 }} severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag> */}
          <DataTable value={pedido.listaDetalleVenta}
            size="small"
            className="col-12 p-1"
            stripedRows showGridlines
            tableStyle={{ minWidth: '20rem' }}>
            <Column align={"center"} field="cantidad" header="Cantidad"></Column>
            <Column align={"center"} field="producto.nombre" header="Producto"></Column>
            <Column align={"center"} field="descripcion" header="Descripcion"></Column>
          </DataTable>
        </div>
        );
      }


    return (
        <div className="grid flex justify-content-center flex-wrap">
            <div className="col-12">
            <DataTable value={ventas} header={header}
                globalFilter={globalFilter}
                className="col-12 p-1" stripedRows
                tableStyle={{ minWidth: '35rem' }}
                emptyMessage="No hay pedidos en proceso..."
                
            >
                <Column align={"center"} body={buttonPedidoFinalizado} />
                <Column align={"center"} body={itemPedido} header="Detalle" />
                <Column align={"center"} field="nombrecliente" header="Cliente"/>
                <Column align={"center"} field="fecha" header="Fecha" />
                <Column align={"center"} field="preciototal" header="Precio Total" />
                <Column align={"center"} body={severity} field="estado" header="Estado" />
            </DataTable>

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
