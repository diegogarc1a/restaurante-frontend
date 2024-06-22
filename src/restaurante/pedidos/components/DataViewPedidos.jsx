import React, { Fragment, useEffect, useRef, useState } from "react";
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
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { DialogPago } from "./DialogPago";
import { DialogEditPedido } from "./DialogEditPedido";
import { Dropdown } from "primereact/dropdown";


export const DataViewPedidos = ({estado}) => {
    const [visible, setVisible] = useState(false);
    const [visibleDialogEliminar, setVisibleDialogEliminar] = useState(false);
    const [visiblePago, setVisiblePago] = useState(false);
    const [visibleEditPedido, setVisibleEditPedido] = useState(false);
    const { ventas, startDeletingVenta, addVentaWS, updateVentaWS, eliminarVentaWS, pedidoFinalizado, cambiarEstadoDv, setActiveVenta, addDetalleVenta, totalRecords } = useVentaStore();
    const [pedido, setPedido] = useState(null);

    const toast = useRef(null);
    
    
    let notificationSound = new Audio('./sounds/beep.mp3'); 

    
      const [stompClient, setStompClient] = useState(null);



      useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_API_URL}ws`);
        const client = Stomp.over(socket);
    
        client.connect({}, (frame) => {
        console.log("Connected: " + frame);
        client.subscribe("/topic/ventas", (message) => {
            // console.log("Message received: " + message.body);
            addVentaWS(JSON.parse(message.body));
            notificationSound.play();
            toast.current.show({severity:'info', summary: 'Informacion!', detail:'Nuevo pedido!!!', life: 5000, });
        });
        client.subscribe("/topic/editventas", (message) => {
            // console.log("Message received: " + message.body);
            const data = JSON.parse(message.body);
            updateVentaWS(data);

        });
        client.subscribe("/topic/eliminarventas", (message) => {
            eliminarVentaWS(JSON.parse(message.body));
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
        
   

      const filterVentas = (ventas) => {
        return ventas.filter((venta) => venta.estado === estado);
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
        setPedido(pedido);
        };
      };

      const onSelectPedidoPagar = (pedido) => {
        return () => {
        setActiveVenta(pedido);
        setVisiblePago(true);
        };
      };

      const onSelectPedidoEditar = (pedido) => {
        return () => {
        setActiveVenta(pedido);
        pedido.listaDetalleVenta.forEach((item)=> {
            addDetalleVenta(item);
        });
        
        setVisibleEditPedido(true);
        };
      }; 

      const onSelectPedidoEliminar = (pedido) => {
        return () => {
        setVisibleDialogEliminar(true);
        setPedido(pedido);
        };
      };

      const onChangeEstado = (detalleVenta) => () => {
        cambiarEstadoDv(detalleVenta)
      }
      const rowClassName = (data) => {
        if ('estadoFinal' in data) {
          return ((data.estadoFinal == false) ? '' : 'p-disabled')
          
        } else {
          return '';
        }
    }

      const selectedBodyTemplate = (detalleVenta) => {
        return (
            <Fragment>
                <Checkbox checked={detalleVenta.estado} onClick={onChangeEstado(detalleVenta)} />
            </Fragment>
        )
      };

    const gridItem = (pedido, index) => {
        
        return (
            <div className="sm:col-12 col-12 p-1" key={pedido.id}>
                <div className={classNames("p-4 border-1 border-round shadow-6", { 'bg-teal-100 text-teal-900' : index === 0 && pedido.estado === 'Proceso'})}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user"></i>
                            <span className="font-semibold">{pedido.nombrecliente}</span>
                        </div>
                            <span className="font-semibold">
                                {pedido.fecha ? format(parseISO(pedido.fecha.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6')), 'cccc, dd MMMM y, h:mm:ss a', { locale: es }) : ''}
                            </span>
                            <div>
                            <Tag severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag>
                    
                            {
                            pedido.estado != 'Pagado' && 
                            <Button icon="pi pi-trash" severity="danger" size="large" className="p-button-rounded mr-2 ml-2" onClick={onSelectPedidoEliminar(pedido)}></Button>
                            }

                            </div>

                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <DataTable value={pedido.listaDetalleVenta}
                        size="small" rowClassName={rowClassName}
                        className="col-12 p-1" 
                        stripedRows showGridlines  
                        tableStyle={{ minWidth: '20rem' }}

                        >
                            {
                            pedido.estado === "Proceso" &&
                            <Column body={selectedBodyTemplate} align={"center"} header="¿Listo?"/>
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
                            (pedido.estado === "Proceso") &&
                            (
                            <>
                            <div className="flex">
                                 <Button icon="pi pi-pencil" severity="info" size="large" className="p-button-rounded mr-2" onClick={onSelectPedidoEditar(pedido)}></Button>
                                <Button icon="pi pi-check-circle" severity="success" size="large"
                                className="p-button-rounded" onClick={onSelectPedido(pedido)}></Button>
                            </div>
                            </>
                            )
                           
                        }
                        {
                            (pedido.estado === "Terminado") &&
                             (
                            <>
                            <div className="flex">
                                <Button icon="pi pi-pencil" severity="info" size="large" className="p-button-rounded mr-2" onClick={onSelectPedidoEditar(pedido)}></Button>
                                <Button icon="pi pi-money-bill" severity="success" size="large" className="p-button-rounded" onClick={onSelectPedidoPagar(pedido)}></Button>
                            </div>
                            </>
                            )
                            
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
          
            <div className="flex justify-content-center m-2">
                <div className="ml-2">
                    {
                        filterVentas(ventas) == '' ? <span>No hay pedidos disponibles en {estado}</span> 
                        : <div className="ml-2"> Pedidos en {estado} </div>
                    }
                </div>
            </div>
            
        </div>
        );
    };


    //Confirmacion al marcar pedido como Finalizado
    const acceptDialog = () => {
        pedidoFinalizado(pedido);
    }

    const rejectDialog = () => {
        console.log("Rechazado")
    }

    //Confirmacion al marcar pedido para Eliminarlo
    const acceptDialogEliminar = () => {
        startDeletingVenta(pedido);
    }

    const rejectDialogEliminar = () => {
        console.log("Rechazado")
    }


    const templatePaginator = {
        layout: 'PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown',
        RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 30, value: 20 },
                { label: 120, value: 120 }
            ];

            return (
                <React.Fragment>
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Items por página:{' '}
                    </span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        },
        CurrentPageReport: (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} de {options.totalRecords}
                </span>
            );
        }
    };


    return (
        <div className="grid flex justify-content-center flex-wrap">
            <Toast ref={toast} position="bottom-right"/>
            <div className="col-12">

            <DataView value={filterVentas(ventas)} listTemplate={listTemplate} header={header()} emptyMessage="No hay pedidos disponibles"
            paginator paginatorTemplate={templatePaginator} rows={10} paginatorPosition="both" totalRecords={filterVentas(ventas).lenght}
            />
            <ConfirmDialog group="declarative" visible={visible} 
                onHide={() => setVisible(false)} 
                message="Estas seguro de marcar el pedido como Finalizado?" 
                header="Confirmacion" acceptLabel="Sí" 
                rejectLabel="No" icon="pi pi-exclamation-triangle" 
                accept={acceptDialog} reject={rejectDialog} 
                draggable={false}
            />

            <ConfirmDialog group="declarative" visible={visibleDialogEliminar} 
                onHide={() => setVisibleDialogEliminar(false)} 
                message="Estas seguro de eliminar el pedido?" 
                header="Confirmacion" acceptLabel="Sí" 
                rejectLabel="No" icon="pi pi-exclamation-triangle" 
                accept={acceptDialogEliminar} reject={rejectDialogEliminar} 
                acceptClassName="p-button-danger"
                draggable={false}
                defaultFocus='reject'

            />
            

            <DialogPago visible={visiblePago} setVisible={setVisiblePago} />
            <DialogEditPedido visible={visibleEditPedido} setVisible={setVisibleEditPedido} />

            </div>
        </div>
    )
}
        